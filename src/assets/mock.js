export const mockOngoingCampaigns = [
  {
    id: "1",
    name: "Summer Fashion Collection",
    company: "StyleHub",
    progress: 75,
    daysLeft: 5,
    status: "active"
  },
  {
    id: "2", 
    name: "Tech Product Launch",
    company: "TechCorp",
    progress: 45,
    daysLeft: 12,
    status: "active"
  },
  {
    id: "3",
    name: "Health & Wellness Drive", 
    company: "WellnessPlus",
    progress: 90,
    daysLeft: 2,
    status: "active"
  },
  {
    id: "4",
    name: "Holiday Special Offer",
    company: "RetailMax", 
    progress: 20,
    daysLeft: 25,
    status: "active"
  }
];

export const mockCompletedCampaigns = [
  {
    id: "5",
    name: "Spring Sale Campaign",
    company: "FashionForward",
    endDate: "Dec 10, 2024",
    revenue: 45200,
    performance: "Excellent"
  },
  {
    id: "6",
    name: "Black Friday Deals", 
    company: "ElectroStore",
    endDate: "Nov 30, 2024",
    revenue: 89500,
    performance: "Good"
  },
  {
    id: "7",
    name: "Back to School",
    company: "BookWorld", 
    endDate: "Sep 15, 2024",
    revenue: 12800,
    performance: "Average"
  }
];

export const mockStats = {
  assignedBusinesses: 24,
  totalSales: 2400000,
  totalCampaigns: 156,
  businessGrowth: 12,
  salesGrowth: 18,
  campaignGrowth: 23
};

// New business mock data
export const mockBusinesses = [
  {
    id: "1",
    name: "StyleHub",
    category: "Fashion & Retail",
    description: "Leading fashion retailer with premium collections",
    employee_count: 150,
    status: "active",
    created_at: "2024-01-15",
    icon: "🛍️"
  },
  {
    id: "2", 
    name: "TechCorp",
    category: "Technology",
    description: "Enterprise software solutions provider",
    employee_count: 500,
    status: "active",
    created_at: "2024-02-20",
    icon: "💻"
  },
  {
    id: "3",
    name: "WellnessPlus", 
    category: "Health & Wellness",
    description: "Holistic health and wellness platform",
    employee_count: 75,
    status: "active",
    created_at: "2024-03-10",
    icon: "🌿"
  },
  {
    id: "4",
    name: "RetailMax",
    category: "Retail", 
    description: "Multi-category retail chain",
    employee_count: 300,
    status: "active",
    created_at: "2024-01-05",
    icon: "🏪"
  },
  {
    id: "5",
    name: "ElectroStore",
    category: "Electronics",
    description: "Consumer electronics and gadgets",
    employee_count: 200,
    status: "inactive",
    created_at: "2024-02-28",
    icon: "⚡"
  },
  {
    id: "6",
    name: "BookWorld",
    category: "Publishing",
    description: "Online bookstore and publishing house", 
    employee_count: 50,
    status: "active",
    created_at: "2024-03-15",
    icon: "📚"
  }
];


export const campaignTypes = [
  "Product Launch",
  "Brand Awareness", 
  "Seasonal Sale",
  "Lead Generation",
  "Customer Retention",
  "Social Media",
  "Email Marketing",
  "Influencer Partnership"
];

export const campaignGoals = [
  "Increase Brand Awareness",
  "Drive Website Traffic", 
  "Generate Leads",
  "Boost Sales Conversion",
  "Improve Customer Engagement",
  "Launch New Product",
  "Increase Social Media Followers",
  "Enhance Brand Reputation",
  "Expand Market Reach",
  "Promote Special Offer",
  "Customer Retention",
  "Educate Target Audience"
];

// Add this to your mock.js file
export const mockNotifications = [
  {
    id: 1,
    title: "New campaign approval needed",
    message: "Campaign 'Summer Sale' requires your approval",
    time: "2 minutes ago",
    type: "approval",
    unread: true
  },
  {
    id: 2,
    title: "Business 'TechCorp' added successfully",
    message: "New business has been added to your portfolio",
    time: "1 hour ago",
    type: "success",
    unread: true
  },
  {
    id: 3,
    title: "Campaign 'Summer Sale' ended",
    message: "Your campaign has completed successfully",
    time: "3 hours ago",
    type: "info",
    unread: false
  }
];

// Add to your existing mock.js file

export const mockInfluencers = [
  {
    id: "inf1",
    name: "David Rodriguez",
    category: "Business",
    country: "Spain",
    description: "Business and entrepreneurship content creator. Helps brands connect with...",
    followers: "78K",
    engagement: "4.7%",
    typicalRateMin: 1500,
    typicalRateMax: 2800,
    rating: 4.2,
    image: null
  },
  {
    id: "inf2",
    name: "Emma Williams",
    category: "Travel & Lifestyle",
    country: "Australia",
    description: "Travel and lifestyle blogger with authentic storytelling approach. Creat...",
    followers: "203K",
    engagement: "3.5%",
    typicalRateMin: 3000,
    typicalRateMax: 5000,
    rating: 4.7,
    image: null
  },
  {
    id: "inf3",
    name: "James Thompson",
    category: "Food & Dining",
    country: "United States",
    description: "Food and restaurant reviewer with strong local following. Expert in...",
    followers: "67K",
    engagement: "6.2%",
    typicalRateMin: 1200,
    typicalRateMax: 2500,
    rating: 4.9,
    image: null
  },
  {
    id: "inf4",
    name: "Lisa Martinez",
    category: "Beauty & Skincare",
    country: "Mexico",
    description: "Beauty and skincare enthusiast. Creates detailed product reviews and tutorials...",
    followers: "142K",
    engagement: "4.8%",
    typicalRateMin: 2000,
    typicalRateMax: 3500,
    rating: 4.3,
    image: null
  },
  {
    id: "inf5",
    name: "Ryan Cooper",
    category: "Fitness",
    country: "Germany",
    description: "Fitness trainer and nutrition coach. Motivates audience through workout...",
    followers: "98K",
    engagement: "5.3%",
    typicalRateMin: 1600,
    typicalRateMax: 2900,
    rating: 4.5,
    image: null
  },
  {
    id: "inf6",
    name: "Sophie Dubois",
    category: "Art & Design",
    country: "France",
    description: "Art and design curator. Showcases emerging artists and design trends to...",
    followers: "87K",
    engagement: "4.1%",
    typicalRateMin: 1700,
    typicalRateMax: 3100,
    rating: 4.1,
    image: null
  },
  {
    id: "inf7",
    name: "Sarah Johnson",
    category: "Fashion & Lifestyle",
    country: "United States",
    description: "Fashion & lifestyle influencer with focus on sustainable fashion. Creates...",
    followers: "125K",
    engagement: "4.2%",
    typicalRateMin: 2500,
    typicalRateMax: 4000,
    rating: 4.8,
    image: null
  },
  {
    id: "inf8",
    name: "Alex Chen",
    category: "Technology",
    country: "Canada",
    description: "Tech reviewer and digital marketing expert. Specializes in product launche...",
    followers: "89K",
    engagement: "5.1%",
    typicalRateMin: 1800,
    typicalRateMax: 3200,
    rating: 4.6,
    image: null
  },
  {
    id: "inf9",
    name: "Maya Patel",
    category: "Health & Wellness",
    country: "United Kingdom",
    description: "Wellness coach and healthy lifestyle advocate. Expert in creating engaging...",
    followers: "156K",
    engagement: "3.8%",
    typicalRateMin: 2200,
    typicalRateMax: 3800,
    rating: 4.4,
    image: null
  }
];

export const influencerCategories = [
  "All categories",
  "Business",
  "Travel & Lifestyle",
  "Food & Dining",
  "Beauty & Skincare",
  "Fitness",
  "Art & Design",
  "Fashion & Lifestyle",
  "Technology",
  "Health & Wellness"
];

export const influencerCountries = [
  "All countries",
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Spain",
  "Australia",
  "Mexico"
];

export const mockAuthUser = {
  email: "agency@socialgems.me",
  password: "agency@2025",
  username: "Agency Admin",
  role: "agency"
};

// Add to your existing mock.js file

export const mockGroups = [
  {
    group_id: "grp_1",
    name: "Product Launch Team",
    description: "Discussion about upcoming product launches",
    icon_image_url: null,
    banner_image_url: null,
    members: 8,
    membership_type: "private",
    created_at: "2024-01-15T10:30:00Z",
    created_by: "user_1",
    role: "admin"
  },
  {
    group_id: "grp_2",
    name: "Marketing Strategy",
    description: "Marketing plans and campaign discussions",
    icon_image_url: null,
    banner_image_url: null,
    members: 5,
    membership_type: "private",
    created_at: "2024-02-20T14:15:00Z",
    created_by: "user_2",
    role: "member"
  },
  {
    group_id: "grp_3",
    name: "Design Team",
    description: "Creative brainstorming and design reviews",
    icon_image_url: null,
    banner_image_url: null,
    members: 12,
    membership_type: "open",
    created_at: "2024-03-10T09:00:00Z",
    created_by: "user_1",
    role: "admin"
  }
];

export const mockGroupMessages = {
  grp_1: [
    {
      messageId: "msg_1",
      text: "Hey team! The product launch is scheduled for next week. Are we ready?",
      senderUserName: "Agency Admin",
      senderId: "user_1",
      timestamp: "2024-09-30T08:30:00Z",
      status: "read",
      conversationId: "grp_1",
      receiverId: "grp_1",
      media: null
    },
    {
      messageId: "msg_2",
      text: "Yes! All materials are prepared. Just waiting for final approval.",
      senderUserName: "Sarah Johnson",
      senderId: "user_2",
      timestamp: "2024-09-30T08:35:00Z",
      status: "DELIVERED",
      conversationId: "grp_1",
      receiverId: "grp_1",
      media: null
    },
    {
      messageId: "msg_3",
      text: "Great work everyone! Let's schedule a final review meeting.",
      senderUserName: "Agency Admin",
      senderId: "user_1",
      timestamp: "2024-09-30T09:00:00Z",
      status: "SENT",
      conversationId: "grp_1",
      receiverId: "grp_1",
      media: null
    }
  ],
  grp_2: [
    {
      messageId: "msg_4",
      text: "What's the status on the social media campaign?",
      senderUserName: "Mike Davis",
      senderId: "user_3",
      timestamp: "2024-09-30T07:15:00Z",
      status: "read",
      conversationId: "grp_2",
      receiverId: "grp_2",
      media: null
    },
    {
      messageId: "msg_5",
      text: "We're on track! Content is scheduled for this week.",
      senderUserName: "Agency Admin",
      senderId: "user_1",
      timestamp: "2024-09-30T07:20:00Z",
      status: "read",
      conversationId: "grp_2",
      receiverId: "grp_2",
      media: null
    }
  ],
  grp_3: [
    {
      messageId: "msg_6",
      text: "I've uploaded the new design mockups. Please review!",
      senderUserName: "Emma Wilson",
      senderId: "user_4",
      timestamp: "2024-09-30T10:00:00Z",
      status: "DELIVERED",
      conversationId: "grp_3",
      receiverId: "grp_3",
      media: {
        media_url: "https://cdn.dribbble.com/userupload/45107631/file/f821a586b5a74fd8ac53ad7089669bff.png?resize=2400x1800&vertical=center",
        media_type: "IMAGE",
        mime_type: "image/jpeg",
        size: "2.5MB",
        filename: "design_mockup.jpg"
      }
    },
    {
      messageId: "msg_7",
      text: "Looks amazing! Love the color scheme.",
      senderUserName: "Agency Admin",
      senderId: "user_1",
      timestamp: "2024-09-30T10:15:00Z",
      status: "SENT",
      conversationId: "grp_3",
      receiverId: "grp_3",
      media: null
    }
  ]
};

export const mockGroupMembers = {
  grp_1: [
    {
      user_id: "user_1",
      first_name: "Agency",
      last_name: "Admin",
      email: "agency@socialgems.me",
      profile_pic: null,
      role: "admin",
      joined_at: "2024-01-15T10:30:00Z"
    },
    {
      user_id: "user_2",
      first_name: "Sarah",
      last_name: "Johnson",
      email: "sarah@example.com",
      profile_pic: null,
      role: "member",
      joined_at: "2024-01-16T11:00:00Z"
    }
  ],
  grp_2: [
    {
      user_id: "user_1",
      first_name: "Agency",
      last_name: "Admin",
      email: "agency@socialgems.me",
      profile_pic: null,
      role: "member",
      joined_at: "2024-02-20T14:15:00Z"
    },
    {
      user_id: "user_3",
      first_name: "Mike",
      last_name: "Davis",
      email: "mike@example.com",
      profile_pic: null,
      role: "admin",
      joined_at: "2024-02-20T14:15:00Z"
    }
  ],
  grp_3: [
    {
      user_id: "user_1",
      first_name: "Agency",
      last_name: "Admin",
      email: "agency@socialgems.me",
      profile_pic: null,
      role: "admin",
      joined_at: "2024-03-10T09:00:00Z"
    },
    {
      user_id: "user_4",
      first_name: "Emma",
      last_name: "Wilson",
      email: "emma@example.com",
      profile_pic: null,
      role: "member",
      joined_at: "2024-03-11T10:00:00Z"
    }
  ]
};