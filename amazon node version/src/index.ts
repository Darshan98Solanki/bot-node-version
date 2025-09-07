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
    cookie: string;
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

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Global state
let isRunning = false;
let loopHandle: NodeJS.Timeout | null = null;
let currentLocationIndex = 0;
let availableLocations: string[] = [];
let groupedUsers: Record<string, User[]> = {};

// Maximum speed - no limits, no delays
const LOOP_DELAY = 200; // Absolute 200ms - no compromise

// Minimal caching for speed
const schedulesCache = new Map<string, any[]>();
const jobsCache = new Map<string, any[]>();

// Performance tracking
let processedCount = 0;
let errorCount = 0;

// Get schedules - cached but unlimited concurrent
async function getSchedules(jobId: string): Promise<any[]> {
    if (schedulesCache.has(jobId)) {
        return schedulesCache.get(jobId) || [];
    }

    try {
        const schedules = await getSchedulesForJob(jobId);
        const data = schedules || [];
        schedulesCache.set(jobId, data);
        return data;
    } catch (error) {
        console.log(error)
        return [];
    }
}

// Get jobs - cached but unlimited concurrent
async function getJobs(user: User): Promise<any[]> {
    const cacheKey = `${user.id}_${user.location}`;
    
    if (jobsCache.has(cacheKey)) {
        return jobsCache.get(cacheKey) || [];
    }

    try {
        const result = await getJobsFromUS({ url, headers: user.headers });
        const jobCards = result?.data?.searchJobCardsByLocation?.jobCards || [];
        jobsCache.set(cacheKey, jobCards);
        return jobCards;
    } catch (error) {
        console.log(error)
        return [];
    }
}

// Process single user - unlimited concurrent operations
async function processUser(user: User): Promise<void> {
    try {
        const jobCards = await getJobs(user);
        if(jobCards.length !== 0)
            console.log("job cards---->",jobCards)
        
        if (jobCards.length === 0) return;

        // Process ALL jobs simultaneously - no limits
        const allJobPromises = jobCards.map(async (job) => {
            const jobInfo = {
                jobId: job?.jobId,
                jobTitle: job?.jobTitle,
                jobType: job?.jobType,
                employmentType: job?.employmentType,
                locationName: job?.locationName,
            };

            // Quick location filter
            if (user.location !== "Any" && jobInfo.locationName !== user.location) {
                return [];
            }

            try {
                const schedules = await getSchedules(jobInfo.jobId);
                console.log("shifts---->",schedules)
                // Create ALL applications simultaneously - no limits
                const applicationPromises = schedules.map(async (schedule) => {
                    try {
                        await createApplication(
                            jobInfo.jobId,
                            schedule.scheduleId,
                            user.bbCandidateId,
                            user.accessToken,
                            createApplicationURL,
                            jobInfo,
                            user.cookie
                        );
                        processedCount++;
                    } catch (error) {
                        errorCount++;
                    }
                });

                await Promise.all(applicationPromises);
                
            } catch (error) {
                errorCount++;
            }
        });

        await Promise.all(allJobPromises);

    } catch (error) {
        errorCount++;
    }
}

// Main processing - unlimited concurrent users
async function main({ location, users }: { location: string, users: User[] }): Promise<void> {
    if (!users || users.length === 0) return;

    try {
        // Process ALL users simultaneously - no limits, no delays
        const allUserPromises = users.map(processUser);
        await Promise.all(allUserPromises);
        
    } catch (error) {
        errorCount++;
    }
}

// Initialize users data
async function initializeUsers(): Promise<void> {
    try {
        const usersData = await prisma.user.findMany();
        console.log("usersData---->",usersData)
        groupedUsers = {};
        availableLocations = [];

        usersData.forEach((user: any) => {
            const loc = user.location;
            if (!groupedUsers[loc]) {
                groupedUsers[loc] = [];
                availableLocations.push(loc);
            }
            user.headers = generateHeaderWithAuthToken(user.sessionToken);
            groupedUsers[loc].push(user);
        });

        console.log(`🚀 Initialized ${usersData.length} users across ${availableLocations.length} locations`);
    } catch (error) {
        console.error("Failed to initialize users:", error);
    }
}

// Start ultra-fast processing
async function startUltraFastLoop(): Promise<void> {
    if (isRunning) return;
    
    isRunning = true;
    await initializeUsers();
    
    console.log(`🚀 Starting MAXIMUM SPEED loop - 200ms intervals, NO LIMITS`);
    
    loopHandle = setInterval(async () => {
        if (!isRunning || availableLocations.length === 0) return;

        const location = availableLocations[currentLocationIndex];
        const users = groupedUsers[location];
        
        if (users && users.length > 0) {
            // Fire and forget - don't wait, maintain exact 200ms timing
            main({ location, users }).catch(() => {}); // Silent error handling
        }

        // Move to next location immediately
        currentLocationIndex = (currentLocationIndex + 1) % availableLocations.length;
        
    }, LOOP_DELAY); // Exact 200ms - no compromise
    
    console.log(`✅ MAXIMUM SPEED LOOP ACTIVE - 200ms cycles`);
}

// Performance stats (optional)
setInterval(() => {
    console.log(`⚡ Speed Stats: ${processedCount} processed, ${errorCount} errors, ${schedulesCache.size + jobsCache.size} cached`);
}, 30000);

// Start API
app.post("/start", async (req, res) => {
    try {
        if (isRunning) {
            return res.status(400).json({ message: "Maximum speed loop already running" });
        }

        await startUltraFastLoop();

        res.json({ 
            message: "MAXIMUM SPEED LOOP STARTED - 200ms, NO LIMITS",
            delay: LOOP_DELAY,
            locations: availableLocations.length,
            totalUsers: Object.values(groupedUsers).reduce((sum, users) => sum + users.length, 0),
            warning: "Running at maximum speed - no rate limiting"
        });
    } catch (error) {
        console.error("Error starting loop:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Stop API
app.post("/stop", async (req, res) => {
    try {
        if (!isRunning) {
            return res.status(400).json({ message: "Loop is not running" });
        }

        isRunning = false;
        if (loopHandle) {
            clearInterval(loopHandle);
            loopHandle = null;
        }

        schedulesCache.clear();
        jobsCache.clear();

        console.log("🛑 Maximum speed loop stopped");
        res.json({ message: "Maximum speed loop stopped" });
    } catch (error) {
        console.error("Error stopping loop:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Status API
app.get("/status", (req, res) => {
    res.json({
        isRunning,
        mode: "MAXIMUM SPEED - NO LIMITS",
        loopDelay: LOOP_DELAY,
        currentLocation: isRunning && availableLocations.length > 0 ? availableLocations[currentLocationIndex] : null,
        locationIndex: `${currentLocationIndex + 1}/${availableLocations.length}`,
        totalLocations: availableLocations.length,
        totalUsers: Object.values(groupedUsers).reduce((sum, users) => sum + users.length, 0),
        cacheSize: schedulesCache.size + jobsCache.size,
        performance: {
            processed: processedCount,
            errors: errorCount
        }
    });
});

// Restart API
app.post("/restart", async (req, res) => {
    try {
        isRunning = false;
        if (loopHandle) {
            clearInterval(loopHandle);
            loopHandle = null;
        }

        schedulesCache.clear();
        jobsCache.clear();
        processedCount = 0;
        errorCount = 0;

        await startUltraFastLoop();

        res.json({ 
            message: "Maximum speed loop restarted",
            locations: availableLocations.length,
            totalUsers: Object.values(groupedUsers).reduce((sum, users) => sum + users.length, 0)
        });
    } catch (error) {
        console.error("Error restarting loop:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// User CRUD operations
app.post("/user", async (req, res) => {
    const { id, name, email, location, sessionToken, accessToken, bbCandidateId, cookie } = req.body;

    try {
        let user;

        if (id) {
            user = await prisma.user.update({
                where: { id },
                data: { name, email, location, sessionToken, accessToken, bbCandidateId, cookie },
            });
        } else {
            user = await prisma.user.create({
                data: { name, email, location, sessionToken, accessToken, bbCandidateId, cookie },
            });
        }

        if (isRunning) {
            await initializeUsers();
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.get("/users", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

app.get("/user/:id", async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.params.id } });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: "Invalid ID" });
    }
});

app.delete("/user/:id", async (req, res) => {
    try {
        await prisma.user.delete({ where: { id: req.params.id } });
        
        if (isRunning) {
            await initializeUsers();
        }
        
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: "Invalid ID" });
    }
});

const PORT = 4000;

app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`⚡ MAXIMUM SPEED MODE - 200ms loops, NO LIMITS!`);
});