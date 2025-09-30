"use client"

import { ArrowLeft, CheckCircle, FileText, Users, DollarSign, TrendingUp } from "lucide-react"

export default function CampaignApproval({ 
  campaign, 
  selectedInfluencersData,
  onBack, 
  onApprove 
}) {
  const campaignBudget = parseFloat(campaign?.budget) || 0
  const managementFee = campaignBudget * 0.05
  const availableForInfluencers = campaignBudget - managementFee
  
  const { influencers, amounts, totalAllocated } = selectedInfluencersData
  const influencerList = Object.values(influencers)
  const remainingAvailable = availableForInfluencers - totalAllocated

  const selectedBusiness = campaign?.selectedBusiness

  // Generate initials for profile placeholder
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center hover:bg-yellow-500 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5 text-gray-900" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Campaign Review & Approval
              </h1>
              <p className="text-xs text-gray-600">
                Review all details before approving the campaign
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Campaign Details */}
            <div className="lg:col-span-2 space-y-4">
              {/* Campaign Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Campaign Summary
                </h2>

                {/* Selected Business */}
                {selectedBusiness && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg flex items-center justify-center text-white text-lg font-semibold">
                        {selectedBusiness.icon}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">{selectedBusiness.name}</p>
                        <p className="text-xs text-gray-500">Selected Business</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Campaign Name:</span>
                    <span className="font-semibold text-gray-900">{campaign?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Budget:</span>
                    <span className="font-semibold text-gray-900">${campaignBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Influencers Selected:</span>
                    <span className="font-semibold text-gray-900">{influencerList.length}</span>
                  </div>
                </div>
              </div>

              {/* Influencer Payments */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Influencer Payments
                </h2>
                <p className="text-xs text-gray-600 mb-4">Individual payment breakdown for selected influencers</p>

                <div className="space-y-3">
                  {influencerList.map(influencer => {
                    const amount = parseFloat(amounts[influencer.id]) || 0
                    const percentage = availableForInfluencers > 0 
                      ? ((amount / availableForInfluencers) * 100).toFixed(1)
                      : 0

                    return (
                      <div key={influencer.id} className="p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
                              {getInitials(influencer.name)}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-900">{influencer.name}</p>
                              <p className="text-xs text-gray-500">{influencer.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">${amount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{percentage}% of allocated</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-900">Total Allocated (Influencers):</span>
                      <span className="text-sm font-bold text-gray-900">${totalAllocated.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Budget Breakdown & Actions */}
            <div className="lg:sticky lg:top-[100px] lg:self-start space-y-4 h-fit">
              {/* Budget Breakdown */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Budget Breakdown
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Campaign Budget:</span>
                    <span className="font-semibold text-gray-900">${campaignBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>SG Fee (5%):</span>
                    <span>-${managementFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Available for Influencers:</span>
                    <span className="font-semibold text-gray-900">${availableForInfluencers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Allocated to Influencers:</span>
                    <span className="font-semibold text-gray-900">${totalAllocated.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Remaining Available:</span>
                    <span className="font-semibold text-green-600">${remainingAvailable.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-3 w-3" />
                    Campaign Stats
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of Influencers:</span>
                      <span className="text-gray-900">{influencerList.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Payment:</span>
                      <span className="text-gray-900">
                        ${influencerList.length > 0 
                          ? Math.round(totalAllocated / influencerList.length).toLocaleString()
                          : '0'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget Utilization:</span>
                      <span className="text-gray-900">
                        {availableForInfluencers > 0 
                          ? ((totalAllocated / availableForInfluencers) * 100).toFixed(1)
                          : '0'}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ready to Approve */}
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-start gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-green-900">Ready to Approve</p>
                  </div>
                  <p className="text-xs text-green-700 ml-6">
                    Campaign budget allocation is complete. SG fee of ${managementFee.toLocaleString()} will be deducted from the total budget.
                  </p>
                </div>

                {/* Approve Button */}
                <button
                  onClick={onApprove}
                  className="w-full mt-4 px-4 py-3 bg-gray-900 text-white rounded-md text-xs font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}