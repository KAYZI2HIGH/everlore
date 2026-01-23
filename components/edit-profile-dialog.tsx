"use client";

import { useCharacterLimit } from "@/hooks/use-character-limit";
import { useImageUpload } from "@/hooks/use-image-upload";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImagePlus } from "lucide-react";
import { useId } from "react";

export default function EditProfileDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const id = useId();
  const maxLength = 200;
  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({
    maxLength,
    initialValue:
      "Passionate about learning and growing. Currently exploring web development and automation.",
  });

  const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange } =
    useImageUpload();

  const profileImage =
    previewUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=User";

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-xl border border-slate-200">
        <div
          className="px-6 py-6 h-32"
          style={{
            background:
              "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)",
            borderBottom: "1px solid rgba(16, 185, 129, 0.1)",
          }}
        />

        <div className="-mt-12 flex justify-center">
          <div className="relative">
            <Avatar className="h-20 w-20 border-4 border-white shadow-lg rounded-full">
              <AvatarImage
                src={profileImage}
                alt="Profile"
              />
              <AvatarFallback>User</AvatarFallback>
            </Avatar>
            <button
              onClick={handleThumbnailClick}
              className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              aria-label="Change profile picture"
            >
              <ImagePlus size={14} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-8 space-y-6">
          <form className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Basic Information
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor={`${id}-name`}
                      className="text-sm font-medium"
                    >
                      Full Name
                    </Label>
                    <Input
                      id={`${id}-name`}
                      placeholder="John Learner"
                      defaultValue="John Learner"
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor={`${id}-email`}
                      className="text-sm font-medium"
                    >
                      Email
                    </Label>
                    <Input
                      id={`${id}-email`}
                      type="email"
                      placeholder="john@example.com"
                      defaultValue="john.learner@everlore.com"
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor={`${id}-location`}
                      className="text-sm font-medium"
                    >
                      Location
                    </Label>
                    <Input
                      id={`${id}-location`}
                      placeholder="City, Country"
                      defaultValue="Lagos, Nigeria"
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor={`${id}-phone`}
                      className="text-sm font-medium"
                    >
                      Phone
                    </Label>
                    <Input
                      id={`${id}-phone`}
                      placeholder="+234..."
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Professional Information
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor={`${id}-title`}
                      className="text-sm font-medium"
                    >
                      Profession / Title
                    </Label>
                    <Input
                      id={`${id}-title`}
                      placeholder="E.g. Software Developer, Designer"
                      defaultValue="Full Stack Developer"
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor={`${id}-company`}
                      className="text-sm font-medium"
                    >
                      Current Company
                    </Label>
                    <Input
                      id={`${id}-company`}
                      placeholder="Your company name"
                      defaultValue="Tech Startup Inc."
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor={`${id}-skills`}
                      className="text-sm font-medium"
                    >
                      Skills
                    </Label>
                    <Input
                      id={`${id}-skills`}
                      placeholder="E.g. React, Node.js, Python"
                      defaultValue="React, JavaScript, UI/UX"
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor={`${id}-experience`}
                      className="text-sm font-medium"
                    >
                      Years of Experience
                    </Label>
                    <Input
                      id={`${id}-experience`}
                      placeholder="E.g. 3 years"
                      defaultValue="2 years"
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Social & Portfolio
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor={`${id}-portfolio`}
                      className="text-sm font-medium"
                    >
                      Portfolio Website
                    </Label>
                    <Input
                      id={`${id}-portfolio`}
                      placeholder="https://yourportfolio.com"
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor={`${id}-github`}
                      className="text-sm font-medium"
                    >
                      GitHub
                    </Label>
                    <Input
                      id={`${id}-github`}
                      placeholder="https://github.com/username"
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor={`${id}-linkedin`}
                      className="text-sm font-medium"
                    >
                      LinkedIn
                    </Label>
                    <Input
                      id={`${id}-linkedin`}
                      placeholder="https://linkedin.com/in/username"
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor={`${id}-twitter`}
                      className="text-sm font-medium"
                    >
                      Twitter
                    </Label>
                    <Input
                      id={`${id}-twitter`}
                      placeholder="https://twitter.com/username"
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                About You
              </h3>
              <div className="space-y-2">
                <Label
                  htmlFor={`${id}-bio`}
                  className="text-sm font-medium"
                >
                  Bio
                </Label>
                <Textarea
                  id={`${id}-bio`}
                  placeholder="Tell us about your learning goals and interests..."
                  value={value}
                  onChange={handleChange}
                  maxLength={limit}
                  className="bg-slate-50 border-slate-200 resize-none"
                  rows={4}
                />
                <p className="text-xs text-slate-500 text-right">
                  {limit - characterCount} characters left
                </p>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="border-t border-slate-200 px-6 py-4 bg-slate-50">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-slate-300"
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Save Changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
