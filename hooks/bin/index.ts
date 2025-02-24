import { useQuery } from "@tanstack/react-query";

const useBins = () => {
	return useQuery<Bin[]>({
		queryKey: ["bins"],
		//   queryFn: () => expenseEndpoint.getBins(), // Replace with actual API call
		staleTime: 5 * 60 * 1000,
	});
};
