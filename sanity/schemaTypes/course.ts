export default {
  name: "course",
  title: "Course",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Course Title",
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
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "image",
      title: "Course Thumbnail",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "videoUrl",
      title: "Course Video URL",
      type: "url",
      description:
        "The video URL for enrolled students. Supports YouTube, Vimeo, etc.",
    },
    {
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: "instructor",
      title: "Instructor",
      type: "string",
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Web Development", value: "web-development" },
          { title: "Mobile Development", value: "mobile-development" },
          { title: "Data Science", value: "data-science" },
          { title: "UI/UX Design", value: "ui-ux-design" },
          { title: "Business", value: "business" },
          { title: "YouTube Automation & Content Systems", value: "youtube-automation-content-systems" },
          { title: "Forex Trading Education", value: "forex-trading-education" },
          { title: "Digital Services & Freelancing Skills", value: "digital-services-freelancing-skills" },
          { title: "Online Business & Automation", value: "online-business-automation" },
        ],
      },
    },
    {
      name: "level",
      title: "Level",
      type: "string",
      options: {
        list: [
          { title: "Beginner", value: "beginner" },
          { title: "Intermediate", value: "intermediate" },
          { title: "Advanced", value: "advanced" },
        ],
      },
    },
    {
      name: "duration",
      title: "Duration (hours)",
      type: "number",
    },
    {
      name: "students",
      title: "Student Count",
      type: "number",
      initialValue: 0,
    },
    {
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule: any) => Rule.min(0).max(5),
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
    {
      name: "learningPoints",
      title: "What Students Will Learn",
      type: "array",
      of: [{ type: "string" }],
      description: "List of key learning outcomes",
    },
    {
      name: "highlights",
      title: "Course Highlights",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              type: "string",
            },
          ],
        },
      ],
      description: "Key features of the course",
    },
    {
      name: "modules",
      title: "Course Curriculum",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Module Title",
              type: "string",
            },
            {
              name: "lessons",
              title: "Number of Lessons",
              type: "number",
            },
            {
              name: "duration",
              title: "Duration",
              type: "string",
              description: "e.g., '2.5 hours'",
            },
          ],
        },
      ],
    },
    {
      name: "faqs",
      title: "Frequently Asked Questions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "question",
              title: "Question",
              type: "string",
            },
            {
              name: "answer",
              title: "Answer",
              type: "text",
            },
          ],
        },
      ],
    },
    {
      name: "reviews",
      title: "Student Reviews",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "author",
              title: "Reviewer Name",
              type: "string",
            },
            {
              name: "rating",
              title: "Rating",
              type: "number",
              validation: (Rule: any) => Rule.min(1).max(5),
            },
            {
              name: "text",
              title: "Review Text",
              type: "text",
            },
          ],
        },
      ],
    },
  ],
};
