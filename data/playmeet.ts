export interface Playmeet {
    id: string;
    title: string;
    location: string;
    date: string;
    image: string;
    duration: string;
    participants: number;
  }
  
  export const playmeetData = {
    ongoing: [
      {
        id: '1',
        title: 'Playmeet Elite',
        location: 'Kilo Dog Area Road, Progress',
        date: 'March 22, 2025',
        image: 'https://api.a0.dev/assets/image?text=cute%20husky%20playing%20in%20park&aspect=16:9',
        duration: '20',
        participants: 42
      },
      {
        id: '2',
        title: 'Playmeet Life',
        location: 'Central Road, Block 5',
        date: 'March 23, 2025',
        image: 'https://api.a0.dev/assets/image?text=golden%20retriever%20playing%20fetch&aspect=16:9',
        duration: '30',
        participants: 28
      }
    ],
    posted: [
      {
        id: '3',
        title: 'Playmeet Zone',
        location: 'Pet Paradise Park',
        date: 'March 24, 2025',
        image: 'https://api.a0.dev/assets/image?text=german%20shepherd%20running%20in%20park&aspect=16:9',
        duration: '25',
        participants: 35
      },
      {
        id: '4',
        title: 'Playmeet Plus',
        location: 'Downtown Dog Park',
        date: 'March 25, 2025',
        image: 'https://api.a0.dev/assets/image?text=labrador%20playing%20with%20other%20dogs&aspect=16:9',
        duration: '40',
        participants: 31
      }
    ],
    general: [
      {
        id: '5',
        title: 'Playmeet Basic',
        location: 'Community Pet Area',
        date: 'March 26, 2025',
        image: 'https://api.a0.dev/assets/image?text=dogs%20playing%20together%20in%20park&aspect=16:9',
        duration: '35',
        participants: 38
      },
      {
        id: '6',
        title: 'Playmeet Free',
        location: 'Local Park Square',
        date: 'March 27, 2025',
        image: 'https://api.a0.dev/assets/image?text=multiple%20dogs%20running%20in%20park&aspect=16:9',
        duration: '45',
        participants: 25
      }
    ]
  };

  export const userData = {
    name: "Sandeep Bidwal",
    username: "@sandu",
    profileImage: "https://api.a0.dev/assets/image?text=professional%20male%20with%20glasses%20smiling%20profile%20picture&seed=123",
    pets: [
      {
        id: 1,
        name: "Max",
        type: "Australian Shepherd dog",
        image: "https://api.a0.dev/assets/image?text=happy%20australian%20shepherd%20dog%20closeup&seed=456",
        gender: "Female",
        age: "2Year",
        weight: "10KG",
        isVaccinated: true,
        aboutMe: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum",
        traits: ["Mild", "Mild", "Mild"]
      },
      {
        id: 2,
        name: "Cooper",
        type: "Siamese Cat",
        image: "https://api.a0.dev/assets/image?text=siamese%20cat%20portrait&seed=789",
        gender: "Male",
        age: "1Year",
        weight: "5KG",
        isVaccinated: true,
        aboutMe: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum",
        traits: ["Playful", "Gentle", "Social"]
      }
    ],
    reviews: [
      {
        id: 1,
        name: "Akanksha Maheshwari",
        review: "A very long review"
      },
      {
        id: 2,
        name: "Akanksha Maheshwari",
        review: "A very long review"
      },
      {
        id: 3,
        name: "Akanksha Maheshwari",
        review: "A very long review"
      }
    ]
  };