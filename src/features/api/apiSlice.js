import { createApi } from '@reduxjs/toolkit/query/react';
import axios from 'axios';

const axiosBaseQuery =
    ({ baseUrl } = { baseUrl: '' }) =>
        async ({ url, method, data, params }) => {
            try {
                const result = await axios({
                    url: baseUrl + url,
                    method,
                    data,
                    params,
                    withCredentials: true
                });
                return { data: result.data };
            } catch (axiosError) {
                let err = axiosError;
                return {
                    error: {
                        status: err.response?.status,
                        data: err.response?.data || err.message,
                    },
                };
            }
        };

export const apiSlice = createApi({
    baseQuery: axiosBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/super-admin/login',
                method: 'POST',
                data: credentials,
            }),
        }),
        getMe: builder.query({
            query: () => ({
                url: '/super-admin/user',
                method: 'GET',
            }),
        }),
        getUsers: builder.query({
            query: (params = {}) => ({
                url: '/super-admin/users',
                method: 'GET',
                params,
            }),
        }),
        // Password reset flow for super-admin
        requestResetPasswordOtp: builder.mutation({
            query: (data) => ({
                url: '/super-admin/request-reset-password-otp',
                method: 'POST',
                data,
            }),
        }),
        resendPasswordResetOtp: builder.mutation({
            query: (data) => ({
                url: '/super-admin/resend-password-reset-otp',
                method: 'POST',
                data,
            }),
        }),
        verifyResetPasswordOtp: builder.mutation({
            query: (data) => ({
                url: '/super-admin/verify-reset-password-otp',
                method: 'POST',
                data,
            }),
        }),
        setNewPassword: builder.mutation({
            query: (data) => ({
                url: '/super-admin/set-new-password',
                method: 'PATCH',
                data,
            }),
        }),
        revokeUser: builder.mutation({
            query: (id) => ({
                url: `/super-admin/user/${id}/revoke`,
                method: 'PATCH',
            }),
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/super-admin/user/${id}`,
                method: 'DELETE',
            }),
        }),
        // Coupon management endpoints
        getCoupons: builder.query({
            query: (params = {}) => ({
                url: '/coupons',
                method: 'GET',
                params,
            }),
            providesTags: ['Coupons'],
        }),
        getCouponById: builder.query({
            query: (id) => ({
                url: `/coupons/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Coupons', id }],
        }),
        createCoupon: builder.mutation({
            query: (couponData) => ({
                url: '/coupons',
                method: 'POST',
                data: couponData,
            }),
            invalidatesTags: ['Coupons'],
        }),
        updateCoupon: builder.mutation({
            query: ({ id, ...updates }) => ({
                url: `/coupons/${id}`,
                method: 'PUT',
                data: updates,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Coupons', id },
                'Coupons',
            ],
        }),
        deleteCoupon: builder.mutation({
            query: (id) => ({
                url: `/coupons/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Coupons'],
        }),
        getCouponStats: builder.query({
            query: (id) => ({
                url: `/coupons/${id}/stats`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'CouponStats', id }],
        }),
        validateCoupon: builder.mutation({
            query: (validationData) => ({
                url: '/coupons/validate',
                method: 'POST',
                data: validationData,
            }),
        }),
        getActiveCoupons: builder.query({
            query: () => ({
                url: '/coupons/active',
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useGetMeQuery,
    useGetUsersQuery,
    useRevokeUserMutation,
    useDeleteUserMutation,
    useRequestResetPasswordOtpMutation,
    useResendPasswordResetOtpMutation,
    useVerifyResetPasswordOtpMutation,
    useSetNewPasswordMutation,
    // Coupon hooks
    useGetCouponsQuery,
    useGetCouponByIdQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
    useGetCouponStatsQuery,
    useValidateCouponMutation,
    useGetActiveCouponsQuery,
} = apiSlice;