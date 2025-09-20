"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MoreVertical, Edit3, Trash2, Calendar, Loader2, Save, X, Hash } from "lucide-react"

interface Note {
  id: string;        // _id for React key
  noteId: string;    // noteId to display
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteCardProps {
  note: Note
  onDelete: (noteId: string) => void
  onUpdate: (note: Note) => void
}

export function NoteCard({ note, onDelete, onUpdate }: NoteCardProps) {
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editTitle, setEditTitle] = useState(note.title)
  const [editContent, setEditContent] = useState(note.content)

  const handleDelete = async () => {
    setLoading(true)
    try {
      console.log("notes id", note.noteId);
      
      // ✅ Use the correct backend URL
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notes/${note.noteId}`, {
        method: 'DELETE',
        credentials: 'include', // ✅ Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete note')
      }

      const result = await response.json()
      
      if (result.success) {
        onDelete(note.id) // Using the _id for React key management
        setDeleteDialogOpen(false)
        
        console.log('Note deleted successfully:', result.message)
      } else {
        throw new Error(result.message || 'Delete operation failed')
      }
      
    } catch (error) {
      let errorMessage = 'Failed to delete note'
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      console.error('Delete error:', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) return

    setLoading(true)
    try {
      // ✅ Use the correct backend URL
      const uri = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${uri}/api/notes/${note.noteId}`, {
        method: 'PUT',
        credentials: 'include', // ✅ Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          content: editContent.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update note')
      }

      const result = await response.json()
      
      if (result.success) {
        onUpdate({
          ...note,
          title: editTitle.trim(),
          content: editContent.trim(),
          updatedAt: new Date().toISOString(),
        })
        setEditing(false)
      } else {
        throw new Error(result.message || 'Update operation failed')
      }
      
    } catch (error) {
      console.error("Update error:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      alert(`Failed to update note: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditTitle(note.title)
    setEditContent(note.content)
    setEditing(false)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

      if (diffInHours < 1) {
        return "Just now"
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)} hours ago`
      } else {
        return `${Math.floor(diffInHours / 24)} days ago`
      }
    } catch {
      return "Unknown date"
    }
  }

  // Rest of your component code remains the same...
  if (editing) {
    return (
      <Card className="group hover:shadow-lg transition-all duration-200 border-pale-dogwood/50 bg-gradient-to-br from-card via-card to-card/80">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="h-3 w-3 text-rose-quartz/60" />
            <span className="text-xs text-rose-quartz/60 font-mono">
              {note.noteId || "NA"}
            </span>
          </div>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="text-lg font-semibold border-none p-0 focus:ring-0 bg-transparent"
            placeholder="Note title..."
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
            className="resize-none"
            placeholder="Note content..."
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-rose-quartz">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(note.createdAt)}</span>
              {note.updatedAt !== note.createdAt && <span className="text-rose-quartz/60">• edited</span>}
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={handleCancel} disabled={loading}>
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={loading || !editTitle.trim() || !editContent.trim()}
                className="bg-gradient-to-r from-space-cadet to-ultra-violet hover:from-space-cadet/90 hover:to-ultra-violet/90"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200 border-pale-dogwood/50 bg-gradient-to-br from-card via-card to-card/80">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="h-3 w-3 text-rose-quartz/60" />
            <span className="text-xs text-rose-quartz/60 font-mono">
              {note.noteId || "NA"}
            </span>
          </div>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg line-clamp-2 text-space-cadet dark:text-isabelline">{note.title}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditing(true)}>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-ultra-violet dark:text-pale-dogwood line-clamp-3 mb-4">{note.content}</p>
          <div className="flex items-center gap-1 text-xs text-rose-quartz">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(note.createdAt)}</span>
            {note.updatedAt !== note.createdAt && <span className="text-rose-quartz/60">• edited</span>}
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{note.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
