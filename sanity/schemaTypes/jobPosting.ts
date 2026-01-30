export default {
  name: "jobPosting",
  title: "Job Posting",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Job Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "department",
      title: "Department",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "location",
      title: "Location",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "type",
      title: "Job Type",
      type: "string",
      options: {
        list: [
          { title: "Full-time", value: "Full-time" },
          { title: "Part-time", value: "Part-time" },
          { title: "Freelance", value: "Freelance" },
          { title: "Contract", value: "Contract" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "level",
      title: "Experience Level",
      type: "string",
      options: {
        list: [
          { title: "Junior", value: "Junior" },
          { title: "Mid", value: "Mid" },
          { title: "Senior", value: "Senior" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "description",
      title: "Job Description",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "salary",
      title: "Salary Range",
      type: "string",
    },
    {
      name: "tags",
      title: "Required Skills",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    },
    {
      name: "postedAt",
      title: "Posted At",
      type: "datetime",
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "department",
    },
  },
};
