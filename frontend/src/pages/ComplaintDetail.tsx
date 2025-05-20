import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAxiosRequest from '@/services/axiosInspector';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Loader2,
  MessageSquare,
  User,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface User {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profile_photo: string | null;
  role: string;
}

interface Complaint {
  id: string;
  readableId: string;
  reportedUser: User;
  reportedBy: User;
  reason: string;
  dateReported: string;
  status: string;
}

interface TimelineEntry {
  id: string;
  type: 'STATUS_CHANGE' | 'COMMENT' | 'REPORT_SUBMITTED';
  message: string;
  performedBy: string;
  timestamp: string;
}

export default function ComplaintDetail() {
  const { id } = useParams();
  const { axiosInstance } = useAxiosRequest();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [timelineActivities, setTimelineActivities] = useState<TimelineEntry[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [comment, setComment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/complaints/${id}`);
        setComplaint(response.data);
        setSelectedStatus(response.data.status);
      } catch (err) {
        setError('Failed to fetch complaint.');
      } finally {
        setLoading(false);
      }
    };

    const fetchTimeline = async () => {
      setTimelineLoading(true);
      try {
        const response = await axiosInstance.get(`/complaints/${id}/timeline`);
        setTimelineActivities(response.data);
      } catch (err) {
        console.error('Failed to fetch timeline:', err);
      } finally {
        setTimelineLoading(false);
      }
    };

    fetchComplaint();
    fetchTimeline();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!complaint) return;

    setUpdating(true);
    try {
      await axiosInstance.put(`/complaints/${id}/status`, newStatus, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setComplaint((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
            }
          : null,
      );

      const response = await axiosInstance.get(`/complaints/${id}/timeline`);
      setTimelineActivities(response.data);
    } catch (err) {
      setError('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim() || !complaint) return;

    setUpdating(true);
    try {
      await axiosInstance.post(`/complaints/${id}/comments`, comment.trim(), {
        headers: {
          'Content-Type': 'text/plain',
        },
      });

      setComment('');

      const response = await axiosInstance.get(`/complaints/${id}/timeline`);
      setTimelineActivities(response.data);
    } catch (err) {
      setError('Failed to add comment.');
    } finally {
      setUpdating(false);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusClasses = (status: string) => {
      switch (status.toLowerCase()) {
        case 'resolved':
          return 'bg-green-100 text-green-600 border-green-200';
        case 'pending':
          return 'bg-amber-100 text-amber-600 border-amber-200';
        case 'rejected':
          return 'bg-red-100 text-red-600 border-red-200';
        case 'under_review':
          return 'bg-blue-100 text-blue-600 border-blue-200';
        default:
          return 'bg-gray-100 text-gray-600 border-gray-200';
      }
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${getStatusClasses(status)}`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <span className="ml-2 text-lg">Loading complaint details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-50 rounded-lg border border-red-200 flex items-center justify-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <span className="text-red-600">{error}</span>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No complaint found.</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="container max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Header part */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Complaint Details
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Complaint #{complaint.readableId || complaint.id}
              </p>
            </div>
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        <div className="p-6">
          {/* complaint details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="rounded-lg p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                <h2 className="text-sm font-medium text-gray-500 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Reported User
                </h2>
                <div className="flex items-center mt-2">
                  {complaint.reportedUser?.profile_photo ? (
                    <img
                      src={complaint.reportedUser.profile_photo}
                      alt={complaint.reportedUser.username}
                      className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                      <span className="text-yellow-600 font-medium">
                        {complaint.reportedUser?.username
                          ?.charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {complaint.reportedUser?.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      {`${complaint.reportedUser?.firstName || ''} ${complaint.reportedUser?.lastName || ''}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                <h2 className="text-sm font-medium text-gray-500 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Reported By
                </h2>
                <div className="flex items-center mt-2">
                  {complaint.reportedBy?.profile_photo ? (
                    <img
                      src={complaint.reportedBy.profile_photo}
                      alt={complaint.reportedBy.username}
                      className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                      <span className="text-yellow-600 font-medium">
                        {complaint.reportedBy?.username
                          ?.charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {complaint.reportedBy?.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      {`${complaint.reportedBy?.firstName || ''} ${complaint.reportedBy?.lastName || ''}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                <h2 className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Reported
                </h2>
                <p className="mt-2 text-sm">
                  {new Date(complaint.dateReported).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <div>
              <div className="rounded-lg p-4 border border-gray-100 hover:shadow-sm transition-shadow h-full">
                <h2 className="text-sm font-medium text-gray-500 mb-2">
                  Reason for Complaint
                </h2>
                <div className="p-4 bg-gray-50 rounded-md mt-2">
                  <p className="text-sm whitespace-pre-wrap">
                    {complaint.reason}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Section*/}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Activity Timeline
            </h2>

            <div className="flex items-center mb-4">
              <select
                className="border border-gray-200 rounded-md px-3 py-2 mr-2 bg-white"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                disabled={updating}
              >
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-white"
                disabled={updating}
                onClick={() => handleStatusChange(selectedStatus)}
              >
                {updating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Update Status
              </Button>
            </div>

            {/* Timeline list */}
            <div className="space-y-6 relative">
              {timelineLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                  <span className="ml-2">Loading timeline...</span>
                </div>
              ) : timelineActivities.length > 0 ? (
                timelineActivities.map((entry, index) => (
                  <div key={entry.id} className="flex">
                    {/* Timeline node */}
                    <div className="z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                      {entry.type === 'STATUS_CHANGE' ? (
                        <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                      ) : (
                        <div className="bg-amber-100 w-8 h-8 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-amber-600" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow pb-6">
                      <div className="flex items-center">
                        <span className="font-medium">{entry.performedBy}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(entry.timestamp).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {entry.type === 'STATUS_CHANGE' ? (
                        <div className="text-sm mt-1">
                          {/* Parse the message to extract status information */}
                          {(() => {
                            const statusRegex = /from\s+(\w+)\s+to\s+(\w+)/i;
                            const match = entry.message.match(statusRegex);

                            if (match && match.length >= 3) {
                              const fromStatus = match[1];
                              const toStatus = match[2];

                              return (
                                <>
                                  Changed status from{' '}
                                  <StatusBadge status={fromStatus} /> to{' '}
                                  <StatusBadge status={toStatus} />
                                </>
                              );
                            }

                            return entry.message;
                          })()}
                        </div>
                      ) : (
                        <div className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                          {entry.message}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-gray-50 rounded-md text-center text-gray-500">
                  No activity yet.
                </div>
              )}

              {/* Add Comment Form */}
              <div className="flex pt-4">
                <div className="z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                  <div className="bg-gray-200 w-8 h-8 rounded-full"></div>
                </div>
                <div className="flex-grow">
                  <Textarea
                    placeholder="Add a comment to the timeline..."
                    className="w-full p-2 text-sm"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button
                    className="mt-2 bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={handleAddComment}
                    disabled={!comment.trim() || updating}
                  >
                    {updating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Add Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              variant="outline"
              className="border-amber-300 text-amber-600 hover:bg-amber-50 mr-2"
              onClick={() => window.history.back()}
            >
              Back to Complaints
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
