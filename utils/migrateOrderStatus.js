import mongoose from 'mongoose';
import Order from '../models/orderModel.js';
import dotenv from 'dotenv';

dotenv.config();

const migrateOrderStatus = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Update order status values
    const orderStatusUpdates = await Order.updateMany(
      { status: { $in: ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'] } },
      [
        {
          $set: {
            status: {
              $switch: {
                branches: [
                  { case: { $eq: ['$status', 'Pending'] }, then: 'pending' },
                  { case: { $eq: ['$status', 'Processing'] }, then: 'processing' },
                  { case: { $eq: ['$status', 'Shipped'] }, then: 'shipped' },
                  { case: { $eq: ['$status', 'Out for Delivery'] }, then: 'out_for_delivery' },
                  { case: { $eq: ['$status', 'Delivered'] }, then: 'delivered' },
                  { case: { $eq: ['$status', 'Cancelled'] }, then: 'cancelled' }
                ],
                default: '$status'
              }
            }
          }
        }
      ]
    );

    console.log(`Updated ${orderStatusUpdates.modifiedCount} orders with new status values`);

    // Update return request status values
    const returnStatusUpdates = await Order.updateMany(
      { 'items.returnRequest.status': { $in: ['None', 'Requested', 'Approved', 'Rejected', 'Returned', 'Refunded'] } },
      [
        {
          $set: {
            'items': {
              $map: {
                input: '$items',
                as: 'item',
                in: {
                  $mergeObjects: [
                    '$$item',
                    {
                      returnRequest: {
                        $cond: {
                          if: { $ne: ['$$item.returnRequest.status', null] },
                          then: {
                            $mergeObjects: [
                              '$$item.returnRequest',
                              {
                                status: {
                                  $switch: {
                                    branches: [
                                      { case: { $eq: ['$$item.returnRequest.status', 'None'] }, then: 'none' },
                                      { case: { $eq: ['$$item.returnRequest.status', 'Requested'] }, then: 'requested' },
                                      { case: { $eq: ['$$item.returnRequest.status', 'Approved'] }, then: 'approved' },
                                      { case: { $eq: ['$$item.returnRequest.status', 'Rejected'] }, then: 'rejected' },
                                      { case: { $eq: ['$$item.returnRequest.status', 'Returned'] }, then: 'returned' },
                                      { case: { $eq: ['$$item.returnRequest.status', 'Refunded'] }, then: 'refunded' }
                                    ],
                                    default: '$$item.returnRequest.status'
                                  }
                                }
                              }
                            ]
                          },
                          else: '$$item.returnRequest'
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      ]
    );

    console.log(`Updated return request status values in ${returnStatusUpdates.modifiedCount} orders`);

    // Update status timeline values
    const timelineUpdates = await Order.updateMany(
      { 'statusTimeline.status': { $in: ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'] } },
      [
        {
          $set: {
            'statusTimeline': {
              $map: {
                input: '$statusTimeline',
                as: 'timeline',
                in: {
                  $mergeObjects: [
                    '$$timeline',
                    {
                      status: {
                        $switch: {
                          branches: [
                            { case: { $eq: ['$$timeline.status', 'Pending'] }, then: 'pending' },
                            { case: { $eq: ['$$timeline.status', 'Processing'] }, then: 'processing' },
                            { case: { $eq: ['$$timeline.status', 'Shipped'] }, then: 'shipped' },
                            { case: { $eq: ['$$timeline.status', 'Out for Delivery'] }, then: 'out_for_delivery' },
                            { case: { $eq: ['$$timeline.status', 'Delivered'] }, then: 'delivered' },
                            { case: { $eq: ['$$timeline.status', 'Cancelled'] }, then: 'cancelled' }
                          ],
                          default: '$$timeline.status'
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      ]
    );

    console.log(`Updated status timeline values in ${timelineUpdates.modifiedCount} orders`);

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateOrderStatus();
}

export default migrateOrderStatus; 