import { useEffect, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useSharedValue } from "react-native-reanimated";

export function useScrollDirection() {
	const [isScrollingUp, setIsScrollingUp] = useState(true);
	const lastScrollY = useRef(0);
	const currentY = useSharedValue(lastScrollY.current);
	const [scrolling, setScrolling] = useState(false);

	const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const newY = event.nativeEvent.contentOffset.y;
		// console.log("Scroll Y:", newY); // Debugging line
		// setCurrentY(newY);
		// currentY.set(newY);
		currentY.value = newY;
		// console.log(currentY.value);
		setScrolling(!scrolling);

		if (newY < 0) return; // Ignore negative values (pull-to-refresh)

		const scrollingUp = newY < lastScrollY.current;
		// console.log("Scrolling Up:", scrollingUp); // Debugging line
		setIsScrollingUp(scrollingUp);
		lastScrollY.current = newY;
	};

	return { isScrollingUp, onScroll, currentY, scrolling };
}
