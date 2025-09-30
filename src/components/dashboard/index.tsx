"use client";

import { useState } from "react";
import { BusinessManagement } from "../business/BusinessManagement.js";
import CampaignForm from "../Campaigns/CampaignForm.js";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  ClipboardList,
  Target,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import {
  mockOngoingCampaigns,
  mockCompletedCampaigns,
  mockStats,
} from "../../assets/mock.js";

import type { Business } from "@/types";

interface DashboardProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  selectedCompany: string;
  setSelectedCompany: (companyId: string) => void;
  businesses: Business[];
  setBusinesses: React.Dispatch<React.SetStateAction<Business[]>>;
  loading: boolean;
  onRefresh: () => void;
}

const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);

function EnhancedDashboardContent({
  setActiveSection,
  loading,
  onRefresh,
}: any) {
  const getPerformanceBadgeColor = (performance: string) => {
    switch (performance) {
      case "Excellent":
        return "bg-black text-white";
      case "Good":
        return "bg-gray-600 text-white";
      case "Average":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDaysLeftColor = (days: number) => {
    if (days <= 2) return "bg-red-500";
    return "bg-black";
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-2 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Top Stats - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <ClipboardList className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1" />
                    <p className="text-xs text-gray-500 font-medium">
                      Assigned Businesses
                    </p>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    {loading ? (
                      <SkeletonBox className="h-5 sm:h-6 w-10 sm:w-12" />
                    ) : (
                      mockStats.assignedBusinesses
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    Active business accounts
                  </p>
                  <div className="flex items-center">
                    <span className="text-xs text-green-600 font-medium">
                      +{mockStats.businessGrowth}% from last month
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Target className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1" />
                    <p className="text-xs text-gray-500 font-medium">
                      Total Sales
                    </p>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    {loading ? (
                      <SkeletonBox className="h-5 sm:h-6 w-12 sm:w-16" />
                    ) : (
                      `$${(mockStats.totalSales / 1000000).toFixed(1)}M`
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    Revenue generated this quarter
                  </p>
                  <div className="flex items-center">
                    <span className="text-xs text-green-600 font-medium">
                      +{mockStats.salesGrowth}% from last month
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 sm:col-span-2 lg:col-span-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1" />
                    <p className="text-xs text-gray-500 font-medium">
                      Total Campaigns
                    </p>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    {loading ? (
                      <SkeletonBox className="h-5 sm:h-6 w-10 sm:w-12" />
                    ) : (
                      mockStats.totalCampaigns
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    All time campaigns
                  </p>
                  <div className="flex items-center">
                    <span className="text-xs text-green-600 font-medium">
                      +{mockStats.campaignGrowth}% from last month
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Campaigns Grid - Responsive Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {/* Ongoing Campaigns */}
            <div className="bg-white rounded-lg border border-gray-200 order-1">
              <div className="p-3 sm:p-4 border-b border-gray-100">
                <h2 className="text-sm sm:text-base font-bold text-gray-900">
                  Ongoing Campaigns
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Currently active campaigns and their progress
                </p>
              </div>
              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                {mockOngoingCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="bg-white rounded-lg border border-gray-200 p-2 sm:p-3 flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 items-start sm:items-center"
                  >
                    <div className="w-full flex-1">
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 truncate">
                            {campaign.name}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">
                            {campaign.company}
                          </p>
                        </div>
                      </div>

                      <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-6 items-start sm:items-center">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all duration-300"
                            style={{
                              width: `${campaign.progress}%`,
                              backgroundColor: "rgb(249, 215, 105)",
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto">
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {campaign.progress}% complete
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-lg min-w-fit h-fit text-white self-end sm:self-center ${getDaysLeftColor(
                        campaign.daysLeft
                      )}`}
                    >
                      {campaign.daysLeft} days left
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recently Ended Campaigns */}
            <div className="bg-white rounded-lg border border-gray-200 order-2">
              <div className="p-3 sm:p-4 border-b border-gray-100">
                <h2 className="text-sm sm:text-base font-bold text-gray-900">
                  Recently Ended Campaigns
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Performance summary of completed campaigns
                </p>
              </div>
              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                {mockCompletedCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="bg-white rounded-lg border border-gray-200 p-2 sm:p-3 flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 items-start sm:items-center"
                  >
                    <div className="w-full flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 truncate">
                            {campaign.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-0.5 truncate">
                            {campaign.company}
                          </p>
                          <p className="text-xs text-gray-400">
                            Ended {campaign.endDate}
                          </p>
                        </div>
                      </div>

                      <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-6 items-start sm:items-center">
                        <div className="flex items-center w-full sm:w-auto">
                          <span className="text-xs text-gray-500">
                            Revenue: ${campaign.revenue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-lg min-w-fit h-fit self-end sm:self-center ${getPerformanceBadgeColor(
                        campaign.performance
                      )}`}
                    >
                      {campaign.performance}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Dashboard({
  businesses,
  setBusinesses,
  activeSection,
  setActiveSection,
  selectedCompany,
  setSelectedCompany,
  loading,
  onRefresh,
}: DashboardProps) {
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <EnhancedDashboardContent
            businesses={businesses}
            selectedCompany={selectedCompany}
            setActiveSection={setActiveSection}
            loading={loading}
            onRefresh={onRefresh}
          />
        );
      case "businesses":
        return (
          <BusinessManagement
            businesses={businesses}
            setBusinesses={setBusinesses}
            userRole="admin"
            onCreateBusiness={async () => ({ success: true })}
            onUpdateBusiness={async () => ({ success: true })}
            onDeleteBusiness={async () => ({ success: true })}
            loading={loading}
            onRefresh={onRefresh}
          />
        );
      case "campaigns":
        return (
          <CampaignForm
            onBack={() => setActiveSection("dashboard")}
            selectedBusiness={null}
            onCreateCampaign={async (data) => {
              console.log("Creating campaign:", data);
            }}
            onSaveAsDraft={async (data) => {
              console.log("Saving campaign as draft:", data);
            }}
          />
        );
      default:
        return (
          <EnhancedDashboardContent
            businesses={businesses}
            selectedCompany={selectedCompany}
            setActiveSection={setActiveSection}
            loading={loading}
            onRefresh={onRefresh}
          />
        );
    }
  };

  return renderContent();
}