import {
  useEffect,
  useState,
} from "react";

import { format } from "date-fns";
import { useRecoilValue } from "recoil";

import { ResponsiveLine } from "@nivo/line";

import useApi from "../../lib/useApi";
import { useMediaQuery } from "../../lib/useMediaQuery";
import userSelector from "../../state/user";

const MyResponsiveLine = ({ data /* see data tab */ }) => {
	const isMobile = useMediaQuery("(max-width: 768px)");

	return (
		<ResponsiveLine
			data={data}
			margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
			xScale={{ type: "point" }}
			lineWidth={isMobile ? 4 : 8}
			yScale={{
				type: "linear",
				min: "auto",
				max: "auto",
				reverse: false,
			}}
			yFormat=""
			axisTop={null}
			axisRight={null}
			axisBottom={{
				orient: "bottom",
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: "Months",
				legendOffset: 36,
				legendPosition: "middle",
			}}
			axisLeft={{
				orient: "left",
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				tickValues: data.reduce((set, { y }) => set.add(y), new Set()).size + 1,
				legend: "Count",
				legendOffset: -40,
				legendPosition: "middle",
			}}
			enableGridX={false}
			// enableGridY={false}
			pointSize={0}
			pointColor={{ theme: "background" }}
			pointBorderWidth={2}
			pointBorderColor={{ from: "serieColor" }}
			pointLabelYOffset={-12}
			useMesh={true}
			legends={[
				{
					anchor: "top-right",
					direction: "row",
					justify: false,
					translateX: 1,
					translateY: -50,
					itemsSpacing: 0,
					itemDirection: "left-to-right",
					itemWidth: 93,
					itemHeight: 20,
					itemOpacity: 0.75,
					symbolSize: 12,
					symbolShape: "circle",
					symbolBorderColor: "rgba(0, 0, 0, .5)",
					effects: [
						{
							on: "hover",
							style: {
								itemBackground: "rgba(0, 0, 0, .03)",
								itemOpacity: 1,
							},
						},
					],
				},
			]}
			curve="catmullRom"
			colors={{ datum: "color" }}
		/>
	);
};

const addDate = (date, daysToAdd) => new Date(new Date().setDate(date.getDate() + daysToAdd));
const randomNumber = (min, max) => Math.floor(min + Math.random() * (max - min));

export default function Analytics() {
	const user = useRecoilValue(userSelector);
	const [trendData, setTrendData] = useState([
		[-6, -5, -4, -3, -2, -1, 0].map((val) => {
			const today = new Date();
			return {
				x: format(addDate(today, val), "MMM dd"),
				y: 0,
			};
		}),
	]);

	const dataApi = useApi(false);
	useEffect(() => {
		dataApi
			.post("/data/candidatesByField", { field: user.field })
			.then((data) => {
				const today = new Date();
				const newData = [-6, -5, -4, -3, -2, -1, 0].map((val) => {
					const today = new Date();
					return {
						x: format(addDate(today, val), "MMM dd"),
						y: 0,
					};
				});
				data.forEach(({ index, totalCandidates }) => {
					newData[6 + index] = {
						x: format(addDate(today, index), "MMM dd"),
						y: totalCandidates,
					};
				});
				setTrendData((_) => newData);
			})
			.catch(console.error);
	}, []);

	return (
		<main className="grow flex items-stretch h-full">
			<div className="grow p-4 border-r">
				<div
					className="p-6 grow aspect-[16/10] border rounded-lg border-[#e8efff] bg-background-0"
					style={{ boxShadow: "2px 2px 8px rgba(131, 139, 180, 0.25)" }}
				>
					<h1 className="text-lg font-semibold text-letters-secondary">Profile Analytics</h1>
					<MyResponsiveLine
						data={[
							{
								id: "user views",
								color: "#8400ff",
								data: trendData.map(({ x, y }) => ({ x, y: randomNumber(46, 123) })),
							},
							{
								id: "hr views",
								color: "#1251fc",
								data: trendData.map(({ x, y }) => ({ x, y: randomNumber(13, 56) })),
							},
						]}
					/>
				</div>
				<div
					className="p-6 grow aspect-[16/10] border rounded-lg mt-5 border-[#e8efff] bg-background-0"
					style={{ boxShadow: "2px 2px 8px rgba(131, 139, 180, 0.25)" }}
				>
					<h1 className="text-lg font-semibold text-letters-secondary">{user.field} Trends</h1>
					<MyResponsiveLine
						data={[
							{
								id: "candidates",
								color: "#7A77FF",
								data: trendData,
							},
						]}
					/>
				</div>
			</div>
			{/* <div className="hidden md:block shrink-0 w-80 bg-background-0">
				<div className="px-5 py-3 border-b">
					<p className="text-lg font-medium text-letters-secondary">Profile Views</p>
					<p className="text-3xl">206</p>
				</div>
				<div className="px-5 py-3 border-b">
					<p className="text-lg font-medium text-letters-secondary">Total Hits</p>
					<p className="text-3xl">116</p>
				</div>
				<div className="px-5 py-3 border-b">
					<p className="text-lg font-medium text-letters-secondary">Post Views</p>
					<p className="text-3xl">1308</p>
				</div>
			</div> */}
		</main>
	);
}
