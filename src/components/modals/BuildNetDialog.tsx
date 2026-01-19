'use client'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { BellIcon, Trash2, X } from 'lucide-react'

interface BuildNetDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  variant?: "feed" | "my-projects";
}

export default function BuildNetDialog({
  open,
  onClose,
  onConfirm,
  variant = "feed"
}: BuildNetDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
     
      <DialogBackdrop
        transition
         className="fixed inset-0 backdrop-blur-sm transition-opacity pointer-events-none"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl transition-all"
          >
            {/* Close */}
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-400" />
            </button>

            {/* Content */}
            {variant === "feed"?(
              <>
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <BellIcon className="h-6 w-6 text-purple-600" />
                </div>

                <div>
                  <DialogTitle className="text-lg font-bold text-gray-900">
                    Send Collaboration Request
                  </DialogTitle>
                  <p className="mt-2 text-sm text-gray-600">
                    Do you want to send a collaboration request to this user?
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 bg-gray-50 px-6 py-4">
              <button
                onClick={onClose}
                className="rounded-lg border px-4 py-2 text-gray-700"
              >
                Cancel
              </button>
              <button
               onClick={onConfirm}
                className="rounded-lg bg-linear-to-r from-purple-600 to-blue-600 px-4 py-2 text-white"
              >
                Send Request
              </button>
            </div>
          </>
            ):(
            <>
                 <div className="px-6 pt-6 pb-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-16 items-center justify-center rounded-full bg-red-50">
                  <Trash2 className="h-6 w-6 text-red-500" />
                </div>

                <div>
                  <DialogTitle className="text-lg font-bold text-gray-900">
                    Delete Post
                  </DialogTitle>
                  <p className="mt-2 text-sm text-gray-600">
                      This action cannot be undone. Are you sure you want to delete this post?
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 bg-gray-50 px-6 py-4">
              <button
                onClick={onClose}
                className="rounded-lg border px-4 py-2 text-gray-700"
              >
                Cancel
              </button>
              <button
               onClick={onConfirm}
                className="rounded-lg bg-linear-to-r from-red-500 to-red-500 px-4 py-2 text-white"
              >
                Delete Post
              </button>
            </div>
            </>

            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
