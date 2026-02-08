export interface Conspiracy {
  id: number;
  title: string;
  teaser: string;
  absurdity: 1 | 2 | 3 | 4 | 5;
  difficulty: "Beginner Agent" | "Field Operative" | "Deep State";
}
