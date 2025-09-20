"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, Plus, Sparkles, StickyNote, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/dashboard/header";
import { NoteForm } from "@/components/dashboard/note-form";
import { NoteCard } from "@/components/dashboard/note-card";

interface Note {
  id: string;        // _id for React key
  noteId: string;    // noteId to display  
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  name: string;
  email?: string;
  role: string;
  provider?: string;
}

export function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  /** Fetch notes from backend */
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching notes...");

      // ✅ Use environment variable
     const uri = process.env.NEXT_PUBLIC_BACKEND_URL;

      const res = await axios.get(`${uri}api/userNotes`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
      });
      console.log(res);

      if (res.data.success) {
        const { notes = [], user = null } = res.data.data || {};

        // Map notes with proper field mapping
        const apiNotes: Note[] = notes.map((n: any) => ({
          id: n._id || "NA",
          noteId: n.noteId || "NA",
          title: n.title || "Untitled",
          content: n.content || "",
          createdAt: n.createdAt || new Date().toISOString(),
          updatedAt: n.updatedAt || new Date().toISOString(),
        }));

        setNotes(apiNotes);
        setFilteredNotes(apiNotes);

        if (user) {
          const { name, email, role } = user;
          setUser({ name, email, role });
        } else {
          console.warn("⚠️ No user returned in response");
        }
      } else {
        console.error("API did not return success:", res.data.message);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      
      // Handle specific errors for better UX
      if (err.response?.status === 404) {
        console.error("API endpoint not found. Check backend URL.");
      } else if (err.response?.status === 401) {
        console.error("Unauthorized. Redirecting to login.");
        // localStorage.removeItem("user");
        // router.push("/");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Search filter effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note =>
        note.noteId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  }, [searchQuery, notes]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/");
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      
      if (parsed.data && parsed.data.user) {
        const userData = parsed.data.user;
        setUser({
          name: userData.name,
          email: userData.email,
          role: userData.role
        });
      } else if (parsed.name && parsed.email && parsed.role) {
        setUser({
          name: parsed.name,
          email: parsed.email,
          role: parsed.role
        });
      } else {
        console.error("Invalid user data structure");
        router.push("/");
        return;
      }
      
      fetchNotes();
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/");
    }
  }, [router, fetchNotes]);

  // Updated note creation handler that refreshes data
  const handleNoteCreated = useCallback(async (apiResponse: any) => {
    console.log("Note creation response:", apiResponse);
    
    if (apiResponse) {
      // Close mobile form immediately
      setShowMobileForm(false);
      
      // Refresh all notes from backend to get the latest data
      console.log("Refreshing notes after creation...");
      await fetchNotes();
      
      console.log("Notes refreshed successfully");
    } else {
      console.error("Invalid note response:", apiResponse);
      // Still try to refresh on error
      await fetchNotes();
    }
  }, [fetchNotes]);

  const handleNoteDeleted = useCallback(async (id: string) => {
    console.log("Deleting note with id:", id);
    
    // Remove note from UI immediately for better UX
    setNotes((currentNotes) => {
      const filteredNotes = currentNotes.filter((n) => n.id !== id);
      console.log("Notes after deletion:", filteredNotes.length);
      return filteredNotes;
    });
    
    // Refresh from backend to ensure consistency
    setTimeout(() => {
      fetchNotes();
    }, 500);
  }, [fetchNotes]);

  const handleNoteUpdated = useCallback(async (updated: Note) => {
    console.log("Updating note:", updated);
    
    // Update note in UI immediately
    setNotes((currentNotes) => {
      const updatedNotes = currentNotes.map((n) => 
        n.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : n
      );
      console.log("Notes after update:", updatedNotes.length);
      return updatedNotes;
    });
    
    // Refresh from backend to ensure consistency
    setTimeout(() => {
      fetchNotes();
    }, 500);
  }, [fetchNotes]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-isabelline via-pale-dogwood/20 to-rose-quartz/10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-space-cadet" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-isabelline via-pale-dogwood/20 to-rose-quartz/10">
      <Header user={user} />

      <main className="container mx-auto p-4 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-space-cadet dark:text-isabelline mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-ultra-violet dark:text-pale-dogwood text-sm sm:text-base">
            Ready to organize your thoughts and ideas?
          </p>
        </div>

        <div className="space-y-6 lg:space-y-0 lg:grid lg:gap-6 lg:grid-cols-3">
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-20">
              <NoteForm onNoteCreated={handleNoteCreated} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-space-cadet to-ultra-violet">
                    <StickyNote className="h-4 w-4 text-isabelline" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-space-cadet dark:text-isabelline">
                      Your Notes
                    </h2>
                    <p className="text-sm text-ultra-violet dark:text-pale-dogwood">
                      {filteredNotes.length} of {notes.length} {notes.length === 1 ? "note" : "notes"}
                      {searchQuery && ` matching "${searchQuery}"`}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => setShowMobileForm((prev) => !prev)}
                  className="lg:hidden bg-gradient-to-r from-space-cadet to-ultra-violet hover:from-space-cadet/90 hover:to-ultra-violet/90 rounded-full h-12 w-12 p-0 shrink-0"
                  size="icon"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative mb-4 w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ultra-violet dark:text-pale-dogwood" />
                <Input
                  type="text"
                  placeholder="Search by Note ID or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 bg-white/70 dark:bg-ultra-violet/20 border-pale-dogwood/30 focus:border-space-cadet dark:focus:border-isabelline text-sm"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearSearch}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-pale-dogwood/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {showMobileForm && (
              <div className="lg:hidden mb-6 fade-in">
                <NoteForm onNoteCreated={handleNoteCreated} />
              </div>
            )}

            <div className="space-y-4">
              {filteredNotes.length === 0 ? (
                <Card className="border-dashed border-2 border-pale-dogwood/50 bg-isabelline/20 dark:bg-ultra-violet/10">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pale-dogwood/30 to-rose-quartz/30 mb-4">
                      {searchQuery ? (
                        <Search className="h-8 w-8 text-ultra-violet" />
                      ) : (
                        <Sparkles className="h-8 w-8 text-ultra-violet" />
                      )}
                    </div>
                    <CardTitle className="text-xl text-space-cadet dark:text-isabelline mb-2">
                      {searchQuery ? "No matching notes" : "No notes yet"}
                    </CardTitle>
                    <CardDescription className="text-center max-w-sm mb-4">
                      {searchQuery
                        ? `No notes found matching "${searchQuery}". Try a different search term.`
                        : "Create your first note to get started with your personal collection."
                      }
                    </CardDescription>
                    {searchQuery ? (
                      <Button
                        onClick={clearSearch}
                        variant="outline"
                        className="border-space-cadet text-space-cadet hover:bg-space-cadet hover:text-isabelline"
                      >
                        Clear Search
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setShowMobileForm(true)}
                        className="lg:hidden bg-gradient-to-r from-space-cadet to-ultra-violet hover:from-space-cadet/90 hover:to-ultra-violet/90"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Note
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {filteredNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onDelete={handleNoteDeleted}
                      onUpdate={handleNoteUpdated}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
