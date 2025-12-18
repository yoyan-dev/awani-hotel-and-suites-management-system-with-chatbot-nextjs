import {
  addUser,
  deleteUser,
  fetchUser,
  fetchUsers,
  updateUser,
} from "@/features/users/user-thunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { User } from "@/types/users";

export function useUsers() {
  const dispatch = useAppDispatch();
  const { user, users, isLoading, error } = useAppSelector(
    (state) => state.users
  );
  return {
    user,
    users,
    isLoading,
    error,
    fetchUser: (id: string) => dispatch(fetchUser(id)),
    fetchUsers: () => dispatch(fetchUsers()),
    addUser: (payload: FormData) => dispatch(addUser(payload)),
    updateUser: (payload: User) => dispatch(updateUser(payload)),
    deleteUser: (id: string) => dispatch(deleteUser(id)),
  };
}
