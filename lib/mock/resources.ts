export const mockResources = [
  {
    id: "mock-1",
    title: 'Indian Sign Language 101', 
    description: 'Indian Sign Language 101 Course Playlist', 
    thumbnailUrl: 'https://img.youtube.com/vi/PLxYMaKXKMMcMgg4f47WkG7AM0bb3AyjTi/hqdefault.jpg', 
    type: 'youtube_playlist', 
    contentUrl: 'https://youtube.com/playlist?list=PLxYMaKXKMMcMgg4f47WkG7AM0bb3AyjTi&si=h4OqDk1aZ0PIOk5X',
    createdAt: new Date().toISOString()
  },
  {
    id: "mock-2",
    title: 'Indian Sign Language 201', 
    description: 'Indian Sign Language 201 Course Playlist', 
    thumbnailUrl: 'https://img.youtube.com/vi/PLxYMaKXKMMcNfbb0sOfg5sGJCWCLyKe_K/hqdefault.jpg', 
    type: 'youtube_playlist', 
    contentUrl: 'https://youtube.com/playlist?list=PLxYMaKXKMMcNfbb0sOfg5sGJCWCLyKe_K&si=E8VPdubfdDydKmBZ',
    createdAt: new Date().toISOString()
  },
  {
    id: "mock-3",
    title: 'Goa Board of Education Dictionary', 
    description: 'Goa Board of Education Official YouTube Channel Dictionary', 
    thumbnailUrl: null, 
    type: 'youtube_channel', 
    contentUrl: 'https://youtube.com/@goaboardofeducation?si=GziZoqrqBIlueYXk',
    createdAt: new Date().toISOString()
  }
];
