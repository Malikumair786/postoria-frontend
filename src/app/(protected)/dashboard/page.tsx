import CreatePost from "@/components/CreatePost";
import Post from "@/components/post";

const page = () => {
  return (
    <div className="p-6 min-h-screen space-y-6">
      <CreatePost />
      <Post
        id={1}
        author="Jane Smith"
        authorId="user123"
        authorAvatar="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1746439955~exp=1746443555~hmac=5d373dd03a9a2820c6ca6ec8438c306b8180e95357eca67c341205becf338fc0&w=826"
        content="Beautiful view!"
        imageUrl="https://images.unsplash.com/photo-1743341720521-21fddab6d0bf?q=80&w=1990&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />

      <Post
        id={2}
        author="John Doe"
        authorId="user456"
        authorAvatar="/avatars/john.jpg"
        content="Look at this!"
        imageUrl="https://images.unsplash.com/photo-1726066012751-2adfb5485977?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Ds"
      />

      <Post
        id={3}
        author="Jane Smith"
        authorId="user123"
        authorAvatar="/avatars/jane.jpg"
        content="Just finished working on a new React component!"
      />
    </div>
  );
};

export default page;
