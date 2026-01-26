"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
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
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    phone: "",
    title: "",
    company: "",
    skills: "",
    experience: "",
    portfolio: "",
    github: "",
    linkedin: "",
    twitter: "",
    bio: "",
  });

  const maxLength = 200;
  const {
    value: bioValue,
    characterCount,
    handleChange: handleBioChange,
    maxLength: limit,
  } = useCharacterLimit({
    maxLength,
    initialValue: formData.bio || "Passionate about learning and growing...",
  });

  // Load user data from session on mount
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session?.user?.name || "",
        email: session?.user?.email || "",
      }));
    }
  }, [session]);

  const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange } =
    useImageUpload();

  const profileImage =
    previewUrl ||
    session?.user?.image ||
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id: fieldId, value } = e.target;
    const fieldName = fieldId.replace(`${id}-`, "");

    if (fieldName === "bio") {
      handleBioChange(e);
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement updateUserProfile server action in lib/actions/sanity.actions.ts
      console.log("Saving profile:", formData);
      // This will call a server action to update Sanity user document
      alert("Profile updates will be saved once server action is created");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

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
                      value={formData.name}
                      onChange={handleInputChange}
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
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
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
                      value={formData.location}
                      onChange={handleInputChange}
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
                      value={formData.phone}
                      onChange={handleInputChange}
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
                      value={formData.title}
                      onChange={handleInputChange}
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
                      value={formData.company}
                      onChange={handleInputChange}
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
                      value={formData.skills}
                      onChange={handleInputChange}
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
                      value={formData.experience}
                      onChange={handleInputChange}
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
                      value={formData.portfolio}
                      onChange={handleInputChange}
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
                      value={formData.github}
                      onChange={handleInputChange}
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
                      value={formData.linkedin}
                      onChange={handleInputChange}
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
                      value={formData.twitter}
                      onChange={handleInputChange}
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
                  value={bioValue}
                  onChange={handleInputChange}
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
          <Button
            onClick={handleSaveChanges}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
