
import { useEffect, useState } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import type {
    DailyWorkCalendar as DailyWorkCalendarItem
} from "../../types/dailyWorkStatus";

import {
    getCalendar
} from "../../services/DailyWorkStatusService";

interface DailyWorkCalendarProps {
    onDateClick: (date: string) => void;
    refreshKey: number;
}

const formatDate = (date: Date): string => {
    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const DailyWorkCalendar = ({
    onDateClick,
    refreshKey
}: DailyWorkCalendarProps) => {

    const [calendarData, setCalendarData] =
        useState<DailyWorkCalendarItem[]>([]);

    const [currentDate, setCurrentDate] =
        useState<Date>(new Date());

    const [loading, setLoading] =
        useState(false);

    const loadCalendar = async (
        date: Date
    ) => {
        try {

            setLoading(true);

            const year =
                date.getFullYear();

            const month =
                date.getMonth() + 1;

            const data =
                await getCalendar(
                    year,
                    month
                );

            setCalendarData(data);

        } catch (error) {

            console.error(
                "Failed to load daily work calendar:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadCalendar(currentDate);
    }, [
        currentDate,
        refreshKey
    ]);

    const getStatusForDate = (
        date: Date
    ) => {

        const dateString =
            formatDate(date);

        return calendarData.find(
            item =>
                item.date.substring(0, 10) ===
                dateString
        );
    };

    const handleDateClick = (
        info: {
            dateStr: string;
        }
    ) => {

        onDateClick(
            info.dateStr
        );
    };

    const handleDatesSet = (
        info: {
            view: {
                currentStart: Date;
            };
        }
    ) => {

        setCurrentDate(
            info.view.currentStart
        );
    };

    const handleDayCellClassNames = (
        arg: {
            date: Date;
        }
    ) => {

        const item =
            getStatusForDate(arg.date);

        if (!item) {
            return [];
        }

        return [
            `daily-work-${item.status}`
        ];
    };

    return (
        <div className="daily-work-calendar-wrapper">

            {loading && (
                <div className="daily-work-loading">
                    Loading calendar...
                </div>
            )}

            <FullCalendar
                plugins={[
                    dayGridPlugin,
                    interactionPlugin
                ]}
                initialView="dayGridMonth"
                height="auto"
                dayMaxEvents={false}
                selectable={false}
                dateClick={handleDateClick}
                datesSet={handleDatesSet}
                dayCellClassNames={
                    handleDayCellClassNames
                }
            />

            <div className="daily-work-legend">

                <div className="daily-work-legend-item">

                    <span className="daily-work-dot red" />

                    <span>
                        No Log
                    </span>

                </div>

                <div className="daily-work-legend-item">

                    <span className="daily-work-dot yellow" />

                    <span>
                        Below Required Hours
                    </span>

                </div>

                <div className="daily-work-legend-item">

                    <span className="daily-work-dot green" />

                    <span>
                        Completed
                    </span>

                </div>

                <div className="daily-work-legend-item">

                    <span className="daily-work-dot blue" />

                    <span>
                        Overtime
                    </span>

                </div>

            </div>

        </div>
    );
};

export default DailyWorkCalendar;

