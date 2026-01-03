import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function useAppUser() {
    const { user, isLoaded } = useUser();
    const [appUserId, setAppUserId] = useState<string | null>(null);
    
    useEffect(() => {
        if (!isLoaded || !user) return;

        const syncUserToStrapi = async () => {
            try {
                // 1️⃣ Check if app-user already exists
                const findRes = await api.get(
                    `/api/app-users?filters[clerkUserId][$eq]=${user.id}`
                );

                if (findRes.data.data.length > 0) {
                    const existingUser = findRes.data.data[0];
                    localStorage.setItem("appUserId", existingUser.id.toString());
                    setAppUserId(existingUser.id.toString());
                    console.log("✅ app-user already exists");
                    return;
                }

                // 2️⃣ Create app-user if not found
                console.log("⏳ Creating app-user in Strapi...", {
                    clerkUserId: user.id,
                    email: user.emailAddresses[0].emailAddress,
                    name: user.fullName,
                });

                const createRes = await api.post(
                    "/api/app-users",
                    {
                        data: {
                            clerkUserId: user.id,
                            email: user.emailAddresses[0].emailAddress,
                            name: user.fullName,
                        },
                    }
                );

                const newAppUserId = createRes.data.data.id.toString();

                localStorage.setItem("appUserId", newAppUserId);
                setAppUserId(newAppUserId)
                console.log("✅ app-user created:", createRes.data);

                if (!user.unsafeMetadata?.profileCompleted) {
                    await user.update({
                        unsafeMetadata: {
                            profileCompleted: false,
                        },
                    });
                }

                // 3️⃣ NEW: If user doesn't have profileCompleted metadata, redirect to profile
                if (!user.unsafeMetadata?.profileCompleted) {
                    console.log("⏳ New user detected, redirecting to profile completion...");
                    // Don't navigate here, let the routing logic handle it
                }

            } catch (err) {
                console.error("❌ Error syncing app-user:", err);
            }
        };

        syncUserToStrapi();
    }, [user, isLoaded]);

 return { appUserId, isLoaded,user };
}