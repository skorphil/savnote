import { Block, Button } from "konsta/react";

function Home() {
  return (
    <>
      <Block>
        <p className="font-light">This is block with text</p>
      </Block>
      <Block className="space-y-4">
        <p>Here comes the button</p>
        <Button>Action</Button>
      </Block>
    </>
  );
}

export default Home;
