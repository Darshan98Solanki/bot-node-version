import express from "express";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import cors from "cors";

import { getJobsFromUS } from "./utils/getJobs/getUsJob";
import { getJobsFromCA } from "./utils/getJobs/getCanadaJobs";
import { getSchedulesForJob } from "./utils/getShift";
import { generateHeaderWithAuthToken } from "./consts";
import { createApplication } from "./utils/createApplication";
import { url, createApplicationURL } from "./consts";

interface User {
    id?: string;
    name: string;
    email: string;
    location: string;
    sessionToken: string;
    accessToken: string;
    bbCandidateId: string;
    headers?: any;
}

const locationOptions = [
    "Any",
    "Cambridge, ON",
    "Hamilton, ON",
    "Bolton, ON",
    "Malton, ON",
    "Caledon, ON",
    "Brampton, ON",
    "Mississauga, ON",
    "Etobicoke, ON",
    "Scarborough, ON",
    "Ajex, ON",
    "Whitby, ON",
    "Richmond hill, ON",
    "Conklin, NY"
];

const availableLocations: string[] = []


const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

let isRunning = false;
let loopHandle: NodeJS.Timeout | null = null;
let currentLocationIndex = 0;
const users: Record<string, User[]> = {};

async function main({ location, users }: { location: string, users: User[] }) {

    try {
        users.map(async (user) => {

            const result = await getJobsFromCA({ url, headers: user.headers });
            const jobCards = result?.data?.searchJobCardsByLocation?.jobCards;
            console.log("jobs found",jobCards);

            for (const job of jobCards) {
                const jobInfo: any = {
                    jobId: job?.jobId,
                    jobTitle: job?.jobTitle,
                    jobType: job?.jobType,
                    employmentType: job?.employmentType,
                    locationName: job?.locationName,
                };

                // filter job types
                const schedules = await getSchedulesForJob(jobInfo.jobId);
                jobInfo.schedules = schedules || [];

                if (user.location === "Any" || jobInfo.locationName === user.location)
                    await Promise.all(
                        jobInfo.schedules.map((schedule: any) => {
                            return createApplication(
                                jobInfo.jobId,
                                schedule.scheduleId,
                                user.bbCandidateId,
                                user.accessToken,
                                createApplicationURL,
                                jobInfo
                            );
                        })
                    );
            }
        })
    } catch (err: any) {
        console.error("Error fetching jobs:", err.message);
    }
}

// Start API
app.post("/start", async (req, res) => {
    try {
        if (isRunning) {
            return res.status(400).json({ message: "Job loop already running" });
        }

        isRunning = true;

        // Fetch grouped users before starting main loop
        const usersData = await prisma.user.findMany();
        const users: Record<string, any[]> = {};
        usersData.forEach((user: any) => {
            const loc = user.location;
            if (!users[loc]) {
                users[loc] = [];
                availableLocations.push(user.location);
            }
            user.headers = generateHeaderWithAuthToken(user.sessionToken)
            users[loc].push(user);
        });

        loopHandle = setInterval(async () => {
            if (!isRunning) return;

            const location = availableLocations[currentLocationIndex];
            try {
                // console.log("Calling main() for", location);
                await main({ location, users: users[location] });
            } catch (err: any) {
                console.error(`Error inside loop for ${location}:`, err.message);
            }

            //move to next location
            currentLocationIndex = (currentLocationIndex + 1) % availableLocations.length;
        }, 700); // adjust t 

        res.json({ message: "Job loop started", users });
    } catch (error) {
        console.error("Error starting job loop:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Stop API
app.post("/stop", async (req, res) => {
    try {
        if (!isRunning) {
            return res.status(400).json({ message: "Job loop is not running" });
        }

        isRunning = false;
        if (loopHandle) {
            clearInterval(loopHandle);
            loopHandle = null;
        }

        res.json({ message: "Job loop stopped" });
    } catch (error) {
        console.error("Error stopping job loop:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Create or Update User
app.post("/user", async (req, res) => {
    const { id, name, email, location, sessionToken, accessToken, bbCandidateId } = req.body;

    try {
        let user;

        if (id) {
            // 🔄 Update existing user
            user = await prisma.user.update({
                where: { id },
                data: { name, email, location, sessionToken, accessToken, bbCandidateId },
            });
        } else {
            // ➕ Create new user
            user = await prisma.user.create({
                data: { name, email, location, sessionToken, accessToken, bbCandidateId },
            });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// ✅ Get all users
app.get("/users", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

// ✅ Get single user by ID
app.get("/user/:id", async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.params.id } });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: "Invalid ID" });
    }
});

// ✅ Delete user
app.delete("/user/:id", async (req, res) => {
    try {
        await prisma.user.delete({ where: { id: req.params.id } });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: "Invalid ID" });
    }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));