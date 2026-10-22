
import Refund from "../models/refund.js";
import User from "../models/User.js";
import { calculateRisk } from "./riskScoring.js";

// 1. Create a refund with risk scoring
export const userRefund = async (req, res, next) => {
    if (!req.user?.userID) {
        return res.status(401).json("Please login first");
    }

    try {
        const { amount, reason } = req.body;

        if (amount === undefined || amount === null || amount === "" || !reason) {
            return res.status(400).json("Fill all the fields");
        }

        const refundAmount = Number(amount);

        if (
            !Number.isFinite(refundAmount) ||
            refundAmount <= 0 ||
            typeof reason !== "string" ||
            !reason.trim()
        ) {
            return res.status(400).json("Invalid input");
        }

        const userFind = await User.findById(req.user.userID);

        if (!userFind) {
            return res.status(401).json("User not found");
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentRefundCount = await Refund.countDocuments({
            user: userFind._id,
            createdAt: { $gte: thirtyDaysAgo }
        });

        const { riskScore, riskLevel } = calculateRisk(
            refundAmount,
            recentRefundCount
        );

        const refunded = await Refund.create({
            user: userFind._id,
            amount: refundAmount,
            reason: reason.trim(),
            riskScore,
            riskLevel
        });

        return res.status(201).json(refunded);
    } catch (error) {
        next(error);
    }
};


// 2. View the logged-in customer's refund history
export const refundHistory = async (req, res, next) => {
    if (!req.user?.userID) {
        return res.status(401).json("Login first");
    }

    try {
        const userRefundlist = await Refund.find({
            user: req.user.userID
        }).sort({ createdAt: -1 });

        return res.status(200).json(userRefundlist);
    } catch (error) {
        next(error);
    }
};


// 3. Approve or reject a refund (admin route)
export const refundStatus = async (req, res, next) => {
    const { status } = req.body;

    if (!status) {
        return res.status(400).json("Update status properly");
    }

    try {
        if (status !== "approved" && status !== "rejected") {
            return res.status(400).json("Invalid status");
        }

        const updateStatus = await Refund.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updateStatus) {
            return res.status(404).json("Refund does not exist");
        }

        return res.status(200).json({
            message: "Refund status updated",
            updateStatus
        });
    } catch (error) {
        next(error);
    }
};


// 4. Admin: list and filter refunds
export const adminRefundList = async (req, res, next) => {
    try {
        const { status, riskLevel } = req.query;
        const filter = {};

        // Validate optional status filter
        if (status) {
            if (!["pending", "approved", "rejected"].includes(status)) {
                return res.status(400).json("Invalid status filter");
            }

            filter.status = status;
        }

        // Validate optional risk-level filter
        if (riskLevel) {
            if (!["low", "medium", "high"].includes(riskLevel)) {
                return res.status(400).json("Invalid risk level filter");
            }

            filter.riskLevel = riskLevel;
        }

        const refunds = await Refund.find(filter)
            .sort({ createdAt: -1 })
            .populate("user", "name email");

        return res.status(200).json({
            count: refunds.length,
            refunds
        });
    } catch (error) {
        next(error);
    }
};
