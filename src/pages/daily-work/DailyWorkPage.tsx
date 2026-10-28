
import { useState } from "react";

import Header from "../../components/common/Header";

import DailyWorkCalendar
    from "../../components/daily-work/DailyWorkCalendar";

import DailyWorkStatusModal
    from "../../components/daily-work/DailyWorkStatusModal";

import {
    getStatus,
    createStatus,
    updateStatus
} from "../../services/DailyWorkStatusService";

import type {
    DailyWorkStatus,
    DailyWorkStatusRequest
} from "../../types/dailyWorkStatus";

const DailyWorkPage = () => {

    const userString =
        localStorage.getItem("user");

    const user = userString
        ? JSON.parse(userString)
        : null;

    const [selectedDate, setSelectedDate] =
        useState<string | null>(null);

    const [selectedStatus, setSelectedStatus] =
        useState<DailyWorkStatus | null>(null);

    const [modalOpen, setModalOpen] =
        useState(false);

    const [loadingStatus, setLoadingStatus] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [refreshKey, setRefreshKey] =
        useState(0);

    const [message, setMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    const handleDateClick = async (
        date: string
    ) => {

        try {

            setMessage("");
            setErrorMessage("");

            setSelectedDate(date);
            setSelectedStatus(null);
            setModalOpen(true);
            setLoadingStatus(true);

            const status =
                await getStatus(date);

            setSelectedStatus(status);

        } catch (error: any) {

            console.error(
                "Failed to load daily work status:",
                error
            );

            setErrorMessage(
                error.response?.data?.message ||
                "Unable to load daily work status."
            );

        } finally {

            setLoadingStatus(false);
        }
    };

    const handleSave = async (
        request: DailyWorkStatusRequest
    ) => {

        if (!selectedDate) {
            return;
        }

        try {

            setSaving(true);
            setMessage("");
            setErrorMessage("");

            if (selectedStatus?.id) {

                await updateStatus(
                    selectedDate,
                    request
                );

                setMessage(
                    "Daily work status updated successfully."
                );

            } else {

                await createStatus(
                    request
                );

                setMessage(
                    "Daily work status submitted successfully."
                );
            }

            setModalOpen(false);

            setSelectedDate(null);
            setSelectedStatus(null);

            setRefreshKey(
                previous =>
                    previous + 1
            );

        } catch (error: any) {

            console.error(
                "Failed to save daily work status:",
                error
            );

            setErrorMessage(
                error.response?.data?.message ||
                "Unable to save daily work status."
            );

        } finally {

            setSaving(false);
        }
    };

    const handleClose = () => {

        if (saving) {
            return;
        }

        setModalOpen(false);
        setSelectedDate(null);
        setSelectedStatus(null);
    };

    return (
        <div className="app-page">

            <Header user={user} />

            <main className="daily-work-page">

                <div className="daily-work-page-header">

                    <div>

                        <h1>
                            Daily Work
                        </h1>

                        <p>
                            Track your attendance and
                            submit your daily work status.
                        </p>

                    </div>

                </div>

                {message && (
                    <div className="daily-work-success-message">
                        {message}
                    </div>
                )}

                {errorMessage && (
                    <div className="daily-work-error-message">
                        {errorMessage}
                    </div>
                )}

                <div className="daily-work-card">

                    <div className="daily-work-card-header">

                        <div>

                            <h2>
                                Attendance & Daily Work
                            </h2>

                            <p>
                                Click a date to submit or
                                update your daily work status.
                            </p>

                        </div>

                    </div>

                    <DailyWorkCalendar
                        onDateClick={
                            handleDateClick
                        }
                        refreshKey={
                            refreshKey
                        }
                    />

                </div>

            </main>

            {modalOpen && (
                <DailyWorkStatusModal
                    open={modalOpen}
                    date={
                        selectedDate || ""
                    }
                    status={
                        selectedStatus
                    }
                    saving={
                        saving ||
                        loadingStatus
                    }
                    onClose={
                        handleClose
                    }
                    onSave={
                        handleSave
                    }
                />
            )}

        </div>
    );
};

export default DailyWorkPage;

