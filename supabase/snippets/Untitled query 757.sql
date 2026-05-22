-- INSERT INTO public.learning_resource (title, description, thumbnail_url, type, content_url)
-- VALUES 
--   (
--     'Indian Sign Language 101', 
--     'Indian Sign Language 101 Course Playlist', 
--     'https://img.youtube.com/vi/PLxYMaKXKMMcMgg4f47WkG7AM0bb3AyjTi/hqdefault.jpg', 
--     'youtube_playlist', 
--     'https://youtube.com/playlist?list=PLxYMaKXKMMcMgg4f47WkG7AM0bb3AyjTi&si=h4OqDk1aZ0PIOk5X'
--   ),
--   (
--     'Indian Sign Language 201', 
--     'Indian Sign Language 201 Course Playlist', 
--     'https://img.youtube.com/vi/PLxYMaKXKMMcNfbb0sOfg5sGJCWCLyKe_K/hqdefault.jpg', 
--     'youtube_playlist', 
--     'https://youtube.com/playlist?list=PLxYMaKXKMMcNfbb0sOfg5sGJCWCLyKe_K&si=E8VPdubfdDydKmBZ'
--   ),
--   (
--     'Goa Board of Education Dictionary', 
--     'Goa Board of Education Official YouTube Channel Dictionary', 
--     NULL, 
--     'youtube_channel', 
--     'https://youtube.com/@goaboardofeducation?si=GziZoqrqBIlueYXk'
--   );

INSERT INTO public.learning_resource (title, description, thumbnail_url, type, content_url)
VALUES 
  (
    'ISLRTC Youtube Channel', 
    'Official YouTube Channel of Indian Sign Language Research and Training Centre', 
    NULL, 
    'youtube_channel', 
    'https://youtube.com/@islrtc?si=mG5LacHlNBCeibZi'
  ),
  (
    'ISLRTC Dictionary', 
    'Official Govt of India Indian Sign Language Dictionary database powered by DEPwD (Divyangjan)', 
    NULL, 
    'web_portal', 
    'https://divyangjan.depwd.gov.in/islrtc/'
  );
  