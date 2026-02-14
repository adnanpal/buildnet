import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { GraduationCap} from "lucide-react";

export default function ViewProfile() {
  const { clerkId } = useParams<{ clerkId: string }>();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!clerkId) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        // 1) Find app_user by clerkUserId
        const appUserRes = await api.get(`/api/app-users?filters[clerkUserId][$eq]=${clerkId}`);
        const appUser = appUserRes.data?.data?.[0];
        if (!appUser) {
          setProfile(null);
          setPosts([]);
          return;
        }

        const appUserId = appUser.id;

        // 2) Find author profile linked to this app user
        const authorRes = await api.get(`/api/authors?filters[user][$eq]=${appUserId}&populate=*`);
        const authorItem = authorRes.data?.data?.[0] ?? null;
        const author = authorItem?.attributes ?? authorItem ?? null;

        // 3) Fetch posts by this app user
        const postsRes = await api.get(`/api/posts?filters[app_user][id][$eq]=${appUserId}&populate=*&sort[0]=createdAt:desc`);
        const fetchedPosts = (postsRes.data?.data ?? []).map((p: any) => ({
          id: p.id,
          title: p.attributes?.title ?? p.title,
          description: p.attributes?.description ?? p.description,
          college: p.attributes?.college ?? p.college,
          status: p.attributes?.status ?? p.attributes?.statuss ?? "in-progress",
          raw: p,
        }));

        setProfile({
          appUser: appUser.attributes ?? appUser,
          author,
        });
        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [clerkId]);

  if (loading) return <div className="p-6">Loading profile...</div>;

  if (!profile) return <div className="p-6">Profile not found.</div>;

  const author = profile.author ?? {};
  const avatar = author.avatar ?? (profile.appUser?.username?.charAt?.(0) ?? "U");

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-44 bg-linear-to-br from-purple-600 to-pink-500" />
        <div className="p-8 -mt-20">
          <div className="flex items-center gap-6">
            <div className="w-25 h-25 sm:h-30 sm:w-30 rounded-xl bg-linear-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-3xl sm:text-4xl font-extrabold border-4 border-white shadow-xl">
              {avatar}
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-3xl font-bold bg-linear-to-r from-pink-500 via-red-500 to-yellow-600 bg-clip-text text-transparent  mt-11 sm:mt-12  tracking-tight">{author.name ?? profile.appUser?.username}</h2>
                <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap className="w-4 h-4 mt-1" />
              <p className="text-sm text-purple-600 font-medium mt-1">{author.title}</p>
            
                <span className="text-sm">{author.collegeName ?? author.college ?? profile.appUser?.collegeName ?? profile.appUser?.college ?? ""}</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-gray-700 max-w-2xl">{author.bio ?? "No bio available."}</p>

          <div className="mt-6 flex items-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-purple-600">{posts.length}</div>
              <div className="text-gray-500 text-sm mt-1">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-gray-300">--</div>
              <div className="text-gray-500 text-sm mt-1">Collaborators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-gray-300">--</div>
              <div className="text-gray-500 text-sm mt-1">Contributions</div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Projects</h3>
            <div className="mt-3">
              {posts.length ? (
                <div className="relative">
                  <div className="flex gap-4 overflow-x-auto py-4 px-1 scrollbar-hide">
                    {posts.map((p) => {
                      const tech = p.raw?.attributes?.tech ?? p.raw?.attributes?.tags ?? [];
                      const stars = p.raw?.attributes?.stars ?? p.raw?.attributes?.likes ?? 0;

                      return (
                        <div key={p.id} className="min-w-[300px] w-80 bg-white border border-gray-100 rounded-2xl shadow-lg p-5 shrink-0 flex flex-col justify-between h-full relative">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="text-base font-semibold text-gray-900 line-clamp-2">{p.title}</div>
                                    <div className="absolute top-3 right-3">
                                      <div className={`text-xs font-semibold px-3 py-1 rounded-full ${p.status === 'launched' ? 'bg-blue-50 text-blue-700' : p.status === 'in-progress' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
                                        {p.status}
                                      </div>
                                    </div>
                                  </div>

                                  <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">{p.description}</p>

                                  {tech && tech.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                      {tech.slice(0, 4).map((t: any, i: number) => (
                                        <span key={i} className="px-3 py-1 text-xs bg-purple-50 text-purple-700 rounded-full">{typeof t === 'string' ? t : t.name ?? String(t)}</span>
                                      ))}
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <div className="text-sm">⭐</div>
                                      <div className="text-sm font-semibold">{stars}</div>
                                    </div>
                                    <button className="px-3 py-1.5 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm font-semibold hover:shadow-xl">View</button>
                                  </div>
                                </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">No projects yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
