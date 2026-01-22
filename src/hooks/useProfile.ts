import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { calculateCompletion } from "../components/profilesection/profileHeader";
import api from "../api/axios";
import { toast } from "react-toastify";

export function useProfile(appUserId: number | null) {
    const { user } = useUser();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        profilePhoto: null as File | null,
        specialization: null as number | null,
        currentDegree: "",
        collegeName: "",
        yearOfStudy: "",
        programmingLanguages: [] as string[],
        frameworks: [] as string[],
        experienceLevel: "",
    });

    const [authorId, setAuthorId] = useState<number | null>(null);
    const [isEditMode, setEditMode] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [isHydrated, setIsHydrated] = useState(false);

    // INIT FROM CLERK
    useEffect(() => {
        if (!user) return;

        setFormData((prev) => ({
            ...prev,
            username: user.username || "",
            email: user.primaryEmailAddress?.emailAddress || "",
        }));
        setIsHydrated(true); // hydrated if no appUserId (create mode)
    }, [user]);

    // FETCH PROFILE (EDIT MODE)
    useEffect(() => {
        if (!user || !appUserId) {
            setIsHydrated(true);
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);

                const res = await api.get(
                    `/api/authors?filters[user][$eq]=${appUserId}&populate=*`
                );

                const data = res.data?.data;

                // 🟢 NO PROFILE YET
                if (!data || data.length === 0) {
                    setEditMode(false);
                    setAuthorId(null);
                    setIsHydrated(true);
                    return;
                }

                // 🟢 PROFILE EXISTS
                const author = data[0];

                setAuthorId(author.id);
                setEditMode(true);

                /*const hydrated = {
                    fullName: data.name || "",
                    username: user.username || "",
                    email: user.primaryEmailAddress?.emailAddress || "",
                    profilePhoto: null,
                    specialization: data.specialization?.data?.id ?? null,
                    currentDegree: data.title || "",
                    collegeName: data.collegeName || "",
                    yearOfStudy: data.yearOfStudy || "",
                    programmingLanguages: data.programmingLanguages || [],
                    frameworks: data.frameworks || [],
                    experienceLevel: data.experienceLevel || "",
                };
                */

                setFormData({
                    fullName: data.name ?? "",
                    username: user.username ?? "",
                    email: user.primaryEmailAddress?.emailAddress ?? "",
                    specialization: data.specialization?.data?.id ?? null,
                    currentDegree: data.title ?? "",
                    collegeName: "",
                    yearOfStudy: "",
                    programmingLanguages: [],
                    frameworks: [],
                    experienceLevel: "",
                    profilePhoto: null,
                });
                //setIsHydrated(true);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setEditMode(false);
                setAuthorId(null);
                //setIsHydrated(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, appUserId]);

    // CALCULATE PROGRESS
    useEffect(() => {
        if (!isHydrated) return;
        setCompletionPercentage(calculateCompletion(formData));
    }, [formData, isHydrated]);

    const updateFormData = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleMultiSelect = (field: string, value: string) => {
        const current = (formData as any)[field] || [];
        const updated = current.includes(value)
            ? current.filter((v: string) => v !== value)
            : [...current, value];

        updateFormData(field, updated);
    };

    const handleImageUpload = (file: File, preview: string | ArrayBuffer | null) => {
        if (typeof preview !== "string") return;
        setPreviewImage(preview);
        updateFormData("profilePhoto", file);
    };

    const handleSubmit = async () => {
        if (!user || !appUserId) return;

        try {
            setLoading(true);

            let currentAuthorId = authorId;

            // 🟢 CREATE MODE
            if (!isEditMode) {
                const res = await api.post("/api/authors", {
                    data: {
                        name: formData.fullName,
                        title: formData.currentDegree,
                        avatar: formData.fullName.charAt(0),
                        verified: true,
                        user: appUserId,
                        specialization: formData.specialization, // ✅ ONLY THI
                    },
                });

                currentAuthorId = res.data.data.id;
                setAuthorId(currentAuthorId);
                setEditMode(true);
            }

            // 🟢 UPDATE MODE (ONLY IF ID EXISTS)
            else if (authorId) {
                await api.put(
                    `/api/authors/${authorId}`,
                    {
                        data: {
                            name: formData.fullName,
                            title: formData.currentDegree,
                            avatar: formData.fullName.charAt(0),
                        },
                    }
                );
            }

            // 🟢 CONNECT SPECIALIZATION (OWNER SIDE)

            toast.success("Profile Created Successfully!");
            await user.update({
                unsafeMetadata: { profileCompleted: true },
            });
            navigate("/");

        } catch (err: any) {
            console.error("❌ Save failed", err.response?.data || err);
            toast.error("Profile save failed");
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        completionPercentage,
        isEditMode,
        loading,
        isHydrated,
        previewImage,
        updateFormData,
        handleMultiSelect,
        handleImageUpload,
        handleSubmit,
    };
}