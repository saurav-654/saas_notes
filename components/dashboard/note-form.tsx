"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Loader2 } from "lucide-react"
import axios from "axios"

interface NoteFormProps {
  onNoteCreated: (note: any) => void
}

export function NoteForm({ onNoteCreated }: NoteFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      return
    }

    setLoading(true)
    
    try {
      // Get user from localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const userEmail = userData.data?.user?.email
      
      const uri = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await axios.post(`${uri}api/addnotes`, {
        email: userEmail,
        title: title.trim(),
        content: content.trim()
      })
      
      // Pass the complete API response to the parent
      if (response.data) {
        // location.reload();
        console.log("API Response:", response.data);
        
        // Handle different possible response structures
        const noteData = response.data.data || response.data;
        onNoteCreated(noteData);
        // Clear form only after successful creation
        setTitle("")
        setContent("")
        
      }
    } catch (error) {
      console.error('Error creating note:', error)
      // Optionally show error message to user
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-lg border-pale-dogwood/50 bg-gradient-to-br from-card via-card to-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-space-cadet dark:text-isabelline">
          <Plus className="h-5 w-5" />
          Create New Note
        </CardTitle>
        <CardDescription>Add a new note to your collection</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-space-cadet dark:text-isabelline">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="focus:ring-space-cadet focus:border-space-cadet"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-space-cadet dark:text-isabelline">
              Content
            </Label>
            <Textarea
              id="content"
              placeholder="Write your note content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="focus:ring-space-cadet focus:border-space-cadet resize-none"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-space-cadet to-ultra-violet hover:from-space-cadet/90 hover:to-ultra-violet/90"
            disabled={loading || !title.trim() || !content.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Note
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
