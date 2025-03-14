
export interface Author {
  id: string;
  name: string;
  bio: string;
  profileUrl: string;
}

export interface Book {
  id: string;
  title: string;
  author: Author;
  description: string;
  coverImageUrl: string;
  content: string;
}

export const authors: Author[] = [
  {
    id: "1",
    name: "Jane Austen",
    bio: "Jane Austen was an English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century. Austen's plots often explore the dependence of women on marriage in the pursuit of favorable social standing and economic security.",
    profileUrl: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?q=80&w=300&h=300&fit=crop",
  },
  {
    id: "2",
    name: "Oscar Wilde",
    bio: "Oscar Fingal O'Flahertie Wills Wilde was an Irish poet and playwright. After writing in different forms throughout the 1880s, he became one of London's most popular playwrights in the early 1890s. He is best remembered for his epigrams and plays, his novel The Picture of Dorian Gray, and the circumstances of his criminal conviction.",
    profileUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=300&h=300&fit=crop",
  },
];

export const books: Book[] = [
  {
    id: "1",
    title: "Pride and Prejudice",
    author: authors[0],
    description: "A romantic novel of manners that follows the emotional development of Elizabeth Bennet as she learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.",
    coverImageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&h=600&fit=crop",
    content: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.\n\nHowever little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.\n\n\"My dear Mr. Bennet,\" said his lady to him one day, \"have you heard that Netherfield Park is let at last?\"\n\nMr. Bennet replied that he had not.\n\n\"But it is,\" returned she; \"for Mrs. Long has just been here, and she told me all about it.\"\n\nMr. Bennet made no answer.\n\n\"Do you not want to know who has taken it?\" cried his wife impatiently.\n\n\"You want to tell me, and I have no objection to hearing it.\"\n\nThis was invitation enough.\n\n\"Why, my dear, you must know, Mrs. Long says that Netherfield is taken by a young man of large fortune from the north of England; that he came down on Monday in a chaise and four to see the place, and was so much delighted with it, that he agreed with Mr. Morris immediately; that he is to take possession before Michaelmas, and some of his servants are to be in the house by the end of next week.\"\n\n\"What is his name?\"\n\n\"Bingley.\"\n\n\"Is he married or single?\"\n\n\"Oh! Single, my dear, to be sure! A single man of large fortune; four or five thousand a year. What a fine thing for our girls!\"\n\n\"How so? How can it affect them?\"\n\n\"My dear Mr. Bennet,\" replied his wife, \"how can you be so tiresome! You must know that I am thinking of his marrying one of them.\"\n\n\"Is that his design in settling here?\"\n\n\"Design! Nonsense, how can you talk so! But it is very likely that he may fall in love with one of them, and therefore you must visit him as soon as he comes.\"",
  },
  {
    id: "2",
    title: "The Picture of Dorian Gray",
    author: authors[1],
    description: "A philosophical novel that explores the artistic movement of aestheticism and questions morality, corruption, and the concept of sin with elements of gothic horror and classic Faustian themes.",
    coverImageUrl: "https://images.unsplash.com/photo-1544716280-9c407dcbde35?q=80&w=400&h=600&fit=crop",
    content: "The artist is the creator of beautiful things. To reveal art and conceal the artist is art's aim. The critic is he who can translate into another manner or a new material his impression of beautiful things.\n\nThe highest as the lowest form of criticism is a mode of autobiography. Those who find ugly meanings in beautiful things are corrupt without being charming. This is a fault.\n\nThose who find beautiful meanings in beautiful things are the cultivated. For these there is hope. They are the elect to whom beautiful things mean only beauty.\n\nThere is no such thing as a moral or an immoral book. Books are well written, or badly written. That is all.\n\nThe nineteenth century dislike of realism is the rage of Caliban seeing his own face in a glass.\n\nThe nineteenth century dislike of romanticism is the rage of Caliban not seeing his own face in a glass. The moral life of man forms part of the subject-matter of the artist, but the morality of art consists in the perfect use of an imperfect medium. No artist desires to prove anything. Even things that are true can be proved. No artist has ethical sympathies. An ethical sympathy in an artist is an unpardonable mannerism of style. No artist is ever morbid. The artist can express everything. Thought and language are to the artist instruments of an art. Vice and virtue are to the artist materials for an art. From the point of view of form, the type of all the arts is the art of the musician. From the point of view of feeling, the actor's craft is the type. All art is at once surface and symbol. Those who go beneath the surface do so at their peril. Those who read the symbol do so at their peril. It is the spectator, and not life, that art really mirrors. Diversity of opinion about a work of art shows that the work is new, complex, and vital. When critics disagree, the artist is in accord with himself. We can forgive a man for making a useful thing as long as he does not admire it. The only excuse for making a useless thing is that one admires it intensely.\n\nAll art is quite useless.",
  },
];
