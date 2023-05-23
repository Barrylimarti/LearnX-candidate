import {
  atom,
  selector,
} from "recoil";

const userAtom = atom({
	key: "userAtom",
	default: localStorage.getItem("user")
		? JSON.parse(localStorage.getItem("user"))
		: {
				id: "",
				name: "",
				email: "",
				avatar: "",
				field: "",
				startCompleted: false,
				_v: 0,
		  },
});

const userSelector = selector({
	key: "userSelector",
	get: ({ get }) => get(userAtom),
	set: ({ set, reset }, newValue) => {
		set(userAtom, newValue);
		localStorage.setItem("user", JSON.stringify(newValue));
	},
});

export default userSelector;
