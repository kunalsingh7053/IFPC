const dummyEvents = [
	{
		_id: 'demo-event-esummit-2k24',
		title: 'E-Summit 2K24',
		description:
			'E-Summit 2K24 at Medi-Caps University, Indore, was a major entrepreneurial event featuring expert talks, the Mr. Shark Tank startup pitching session, workshops, and cultural performances focused on innovation and student leadership.',
		eventDate: '2024-11-01T10:00:00.000Z',
		location: 'Medi-Caps University, Indore',
		thumbnail: 'https://ik.imagekit.io/ofm1vl6gr/events/gallery/Esummit-2k24/Thumbnail/IMG_4530-2.JPG?updatedAt=1775289333121',
		images: [
			'https://ik.imagekit.io/ofm1vl6gr/events/gallery/Esummit-2k24/Images/DSC_0006.JPG?updatedAt=1775288933620',
			'https://ik.imagekit.io/ofm1vl6gr/events/gallery/Esummit-2k24/Images/IMG_4425-2.JPG?updatedAt=1775288929757',
			'https://ik.imagekit.io/ofm1vl6gr/events/gallery/Esummit-2k24/Images/Group%20793.jpg?updatedAt=1775288928287',
			'https://ik.imagekit.io/ofm1vl6gr/events/gallery/Esummit-2k24/Images/DSC_0090-3.JPG?updatedAt=1775289090123',
		],
	},
	{
		_id: 'demo-event-convocation-2k24',
		title: 'Convocation 2K24',
		description:
			'Convocation 2K24 at Medi-Caps University celebrated the graduation of students with formal ceremonies, proud moments, and memorable campus captures. The event reflected academic excellence, achievement, and the transition of graduates into their professional journeys.',
		eventDate: '2024-12-01T10:00:00.000Z',
		location: 'Medi-Caps University, Indore',
		thumbnail: 'https://ik.imagekit.io/ofm1vl6gr/events/gallery/Convocation%202k24/Thumbnail/IMG_7245.JPG?updatedAt=1775289708156',
		images: [
			'https://ik.imagekit.io/ofm1vl6gr/events/gallery/Convocation%202k24/Images/IMG_7174.JPG?updatedAt=1775289779835',
			'https://ik.imagekit.io/ofm1vl6gr/events/gallery/Convocation%202k24/Images/IMG_7200.JPG?updatedAt=1775289949765',
			'https://ik.imagekit.io/ofm1vl6gr/events/gallery/Convocation%202k24/Images/Copy%20of%20NZP_4068.JPG?updatedAt=1775289954153',
		],
	},
	{
		_id: 'demo-event-moonstone-2k25',
		title: 'Moonstone 2025',
		description:
			'Moonstone 2025 is the annual cultural and technical fest at Medi-Caps University, Indore, held from March 27 to March 29, 2025. As a key student-led initiative supported by the university and a major part of the Silver Jubilee celebrations, the fest featured concerts, workshops, and competitions that celebrated student talent, creativity, leadership, and campus culture.',
		eventDate: '2025-03-27T10:00:00.000Z',
		location: 'Medi-Caps University, Indore',
		thumbnail: 'https://ik.imagekit.io/ofm1vl6gr/events/gallery/Moonstone-2k25/Thumbnail/IMG_5986.JPG?updatedAt=1775290363556',
		images: [
			'https://ik.imagekit.io/ofm1vl6gr/events/gallery/Moonstone-2k25/Images/_SID0392.JPG?updatedAt=1775290727139',
			'https://ik.imagekit.io/ofm1vl6gr/events/gallery/Moonstone-2k25/Images/DSC_8954.JPG?updatedAt=1775290725313',
			'https://ik.imagekit.io/ofm1vl6gr/events/gallery/Moonstone-2k25/Images/MAP_0641.JPG?updatedAt=1775290726049',
			'https://ik.imagekit.io/ofm1vl6gr/events/gallery/Moonstone-2k25/Images/DSC_9835.JPG?updatedAt=1775290724352',
			'https://ik.imagekit.io/ofm1vl6gr/events/gallery/Moonstone-2k25/Images/IMG_5988.JPG?updatedAt=1775290721477',
		],
	},
	{
		_id: 'demo-event-1',
		title: 'Lenscraft Showcase 2026',
		description:
			'A live showcase of editorial portraits, studio lighting breakdowns, and color grading workflows from IFPC creators.',
		eventDate: '2026-05-10T16:30:00.000Z',
		location: 'IFPC Main Studio, Indore',
		thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=1200&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?q=80&w=1200&auto=format&fit=crop',
		],
	},
	{
		_id: 'demo-event-2',
		title: 'Street Frames Walk',
		description:
			'An outdoor practical session focused on motion blur, candid storytelling, and composition in urban environments.',
		eventDate: '2026-05-18T07:00:00.000Z',
		location: 'Rajwada Heritage Circuit',
		thumbnail: 'https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1499084732479-de2c02d45fc4?q=80&w=1200&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?q=80&w=1200&auto=format&fit=crop',
		],
	},
	{
		_id: 'demo-event-3',
		title: 'Cinematic Product Lab',
		description:
			'Hands-on product filmmaking session with macro rigs, slider shots, and practical transitions for social campaigns.',
		eventDate: '2026-06-02T12:00:00.000Z',
		location: 'Media Lab B2',
		thumbnail: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=1200&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1495427513693-3f40da04b3fd?q=80&w=1200&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200&auto=format&fit=crop',
		],
	},
	{
		_id: 'demo-event-4',
		title: 'Color & Post Masterclass',
		description:
			'Deep dive into color pipelines, LUT design, skin-tone balancing, and final delivery formats for web and OTT.',
		eventDate: '2026-06-12T10:30:00.000Z',
		location: 'Post Suite A1',
		thumbnail: 'https://images.unsplash.com/photo-1601506521937-0121bd0b4a7b?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1600289031463-74f6bdad4cb8?q=80&w=1200&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1513617333961-9f1f5df2f246?q=80&w=1200&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop',
		],
	},
]

export default dummyEvents