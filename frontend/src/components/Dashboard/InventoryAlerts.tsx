import { AlertTriangle, Package, AlertOctagon } from 'lucide-react';

interface InventoryAlertsProps {
  lowStockCount?: number;
  outOfStockCount?: number;
  isLoading?: boolean;
}

export default function InventoryAlerts({ 
  lowStockCount = 0, 
  outOfStockCount = 0, 
  isLoading 
}: InventoryAlertsProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
          <div className="flex items-center justify-between">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-semibold text-orange-600">{lowStockCount}</span>
          </div>
          <p className="mt-2 text-sm font-medium text-orange-900">Low Stock Items</p>
        </div>
        <div className="p-4 rounded-xl bg-red-50 border border-red-100">
          <div className="flex items-center justify-between">
            <AlertOctagon className="w-5 h-5 text-red-500" />
            <span className="text-lg font-semibold text-red-600">{outOfStockCount}</span>
          </div>
          <p className="mt-2 text-sm font-medium text-red-900">Out of Stock</p>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {lowStockCount > 0 ? (
          <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50/50 border border-orange-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-orange-900">Low Stock Alert</h4>
                <p className="text-xs text-orange-600">{lowStockCount} items need reordering</p>
              </div>
            </div>
            <button className="px-3 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded-full hover:bg-orange-200 transition-colors">
              View Items
            </button>
          </div>
        ) : null}

        {outOfStockCount > 0 ? (
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-50/50 border border-red-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertOctagon className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-900">Out of Stock</h4>
                <p className="text-xs text-red-600">{outOfStockCount} items out of stock</p>
              </div>
            </div>
            <button className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors">
              Take Action
            </button>
          </div>
        ) : null}

        {lowStockCount === 0 && outOfStockCount === 0 && (
          <div className="flex items-center justify-center p-8 text-gray-500 bg-gray-50/50 rounded-lg border border-gray-100">
            <p className="text-sm">No inventory alerts at this time</p>
          </div>
        )}
      </div>
    </div>
  );
}
