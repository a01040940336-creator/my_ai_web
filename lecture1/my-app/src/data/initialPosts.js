export const ME = {
  name: '안수은',
  avatar: '🌸',
  email: 'a01040940336@gmail.com',
}

export const FRIENDS = [
  { name: '김민지', avatar: '🌺' },
  { name: '이지은', avatar: '🍀' },
  { name: '박서연', avatar: '🌙' },
]

export const initialPosts = [
  {
    id: 1,
    author: ME,
    date: '2026-06-02',
    timeAgo: '방금 전',
    content: '오늘 날씨가 너무 좋아서 카페에 다녀왔어요 ☕ 딸기 라떼가 진짜 맛있었는데 다들 한번 가봐요!',
    emoji: '☕',
    likes: 5,
    liked: false,
    comments: [
      { id: 1, author: FRIENDS[0], content: '부럽다!! 나도 가고 싶어 🥺', timeAgo: '10분 전' },
      { id: 2, author: FRIENDS[2], content: '어디 카페에요?? 알려줘요!', timeAgo: '5분 전' },
    ],
  },
  {
    id: 2,
    author: FRIENDS[0],
    date: '2026-06-02',
    timeAgo: '1시간 전',
    content: '오늘 친구들이랑 한강 피크닉 다녀왔어요 🌊 날씨 너무 좋았고 너무 즐거웠다~~ 다음엔 다같이 가요!',
    emoji: '🌊',
    likes: 12,
    liked: false,
    comments: [
      { id: 1, author: ME, content: '진짜? 나도 불러줘요 다음엔 ㅠㅠ', timeAgo: '30분 전' },
      { id: 2, author: FRIENDS[2], content: '오 나도 갔었는데!! 못 봤네요 🤣', timeAgo: '20분 전' },
    ],
  },
  {
    id: 3,
    author: FRIENDS[1],
    date: '2026-06-01',
    timeAgo: '어제',
    content: '드디어 새 앨범 나왔다 🎵 오늘 하루종일 반복 재생 중... 노래가 너무 좋아요 여러분도 들어봐요!',
    emoji: '🎵',
    likes: 8,
    liked: false,
    comments: [],
  },
  {
    id: 4,
    author: FRIENDS[2],
    date: '2026-06-01',
    timeAgo: '어제',
    content: '오늘 집에서 쿠키 구웠어요 🍪 생각보다 잘 만들어진 것 같아서 너무 뿌듯해요!! 레시피 필요한 분 댓글 달아요~',
    emoji: '🍪',
    likes: 20,
    liked: false,
    comments: [
      { id: 1, author: FRIENDS[0], content: '저 나눠줄 거죠?? 🥺', timeAgo: '어제' },
      { id: 2, author: ME, content: '레시피 나도 알려줘요!! 저도 만들어보고 싶어요 🍪', timeAgo: '어제' },
    ],
  },
  {
    id: 5,
    author: ME,
    date: '2026-05-28',
    timeAgo: '5일 전',
    content: '오늘 처음으로 요가 수업 들었어요 🧘 생각보다 너무 힘들었지만 끝나고 나서는 몸이 가벼워진 느낌!',
    emoji: '🧘',
    likes: 9,
    liked: false,
    comments: [
      { id: 1, author: FRIENDS[1], content: '오 어디서 배워요? 저도 배우고 싶어요!', timeAgo: '5일 전' },
    ],
  },
  {
    id: 6,
    author: FRIENDS[0],
    date: '2026-05-25',
    timeAgo: '1주일 전',
    content: '벚꽃 구경 다녀왔어요 🌸 올해 벚꽃이 정말 예쁘게 피었더라고요. 너무 좋았다!',
    emoji: '🌸',
    likes: 31,
    liked: false,
    comments: [
      { id: 1, author: ME, content: '사진 보내줘요!! 너무 예쁘겠다 🥹', timeAgo: '1주일 전' },
    ],
  },
]
