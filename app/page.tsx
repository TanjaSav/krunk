import YourPost from "./components/yourpost";
import Writepost from "./components/writepost";

export default function Home() {
  return (
    <>
    <div className="mx-100 my-20">
      <YourPost />
    </div>
    <Writepost />
    </>
  );
}
