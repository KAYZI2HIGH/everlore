export default {
  name: "user",
  title: "User",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule: any) => Rule.required().email(),
    },
    {
      name: "passwordHash",
      title: "Password Hash",
      type: "string",
      hidden: true,
    },
    {
      name: "googleId",
      title: "Google ID",
      type: "string",
      hidden: true,
    },
    {
      name: "image",
      title: "Profile Image",
      type: "url",
    },
    {
      name: "enrolledCourses",
      title: "Enrolled Courses",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "course" }],
        },
      ],
    },
    {
      name: "wishlist",
      title: "Wishlist",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "course" }],
        },
      ],
    },
    {
      name: "cart",
      title: "Shopping Cart",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "course" }],
        },
      ],
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
    },
    {
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
    },
  ],
};
