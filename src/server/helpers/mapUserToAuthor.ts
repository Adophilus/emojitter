import type { User } from "@clerk/nextjs/api";

const mapUserToAuthor = (user: User) => {
  return { id: user.id, username: user.username, profilePicture: user.profileImageUrl };
}

export default mapUserToAuthor
