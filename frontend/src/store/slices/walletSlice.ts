import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  WalletInfo,
  Transaction,
  getWalletInfo,
  getTransactionHistory,
  rechargeWallet,
  withdrawFunds,
  createWallet,
  WithdrawRequest,
} from '@/services/walletService';
import { RootState } from '../store';
import axiosInstance from '@/services/axiosInstance';

interface WalletState {
  walletInfo: WalletInfo | null;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  walletInfo: null,
  transactions: [],
  loading: false,
  error: null,
};

export const fetchWalletInfo = createAsyncThunk<
  WalletInfo,
  void,
  { rejectValue: string }
>('wallet/fetchWalletInfo', async (_, { rejectWithValue }) => {
  try {
    return await getWalletInfo(axiosInstance);
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to fetch wallet info',
    );
  }
});

export const fetchTransactionHistory = createAsyncThunk<
  Transaction[],
  void,
  { rejectValue: string }
>('wallet/fetchTransactionHistory', async () => {
  try {
    const transactions = await getTransactionHistory(axiosInstance);
    return transactions;
  } catch (error: unknown) {
    console.error('Error fetching transactions:', error);
    return [];
  }
});

export const initializeWallet = createAsyncThunk<
  WalletInfo,
  void,
  { rejectValue: string }
>('wallet/createWallet', async (_, { rejectWithValue }) => {
  try {
    return await createWallet(axiosInstance);
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to create wallet',
    );
  }
});

export const addFunds = createAsyncThunk<
  Transaction,
  number,
  { rejectValue: string }
>('wallet/addFunds', async (amount: number, { rejectWithValue, dispatch }) => {
  try {
    const transaction = await rechargeWallet(amount, axiosInstance);
    // Refresh wallet info and transactions after successful recharge
    dispatch(fetchWalletInfo());
    dispatch(fetchTransactionHistory());
    return transaction;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to add funds',
    );
  }
});

export const withdrawAmount = createAsyncThunk<
  Transaction,
  WithdrawRequest,
  { rejectValue: string }
>(
  'wallet/withdrawAmount',
  async (request: WithdrawRequest, { rejectWithValue, dispatch }) => {
    try {
      const transaction = await withdrawFunds(request, axiosInstance);
      // Refresh wallet info and transactions after successful withdrawal
      dispatch(fetchWalletInfo());
      dispatch(fetchTransactionHistory());
      return transaction;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to withdraw funds',
      );
    }
  },
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearWalletError: (state) => {
      state.error = null;
    },
    updateWalletBalance: (state, action: PayloadAction<number>) => {
      if (state.walletInfo) {
        state.walletInfo.amount = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch wallet info
    builder.addCase(fetchWalletInfo.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchWalletInfo.fulfilled,
      (state, action: PayloadAction<WalletInfo>) => {
        state.loading = false;
        state.walletInfo = action.payload;
      },
    );
    builder.addCase(fetchWalletInfo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch wallet info';
    });

    // Fetch transaction history
    builder.addCase(fetchTransactionHistory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchTransactionHistory.fulfilled,
      (state, action: PayloadAction<Transaction[]>) => {
        state.loading = false;
        state.transactions = action.payload;
      },
    );
    builder.addCase(fetchTransactionHistory.rejected, (state) => {
      state.loading = false;
      // Keep existing transactions if fetch fails
    });

    // Initialize wallet
    builder.addCase(initializeWallet.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      initializeWallet.fulfilled,
      (state, action: PayloadAction<WalletInfo>) => {
        state.loading = false;
        state.walletInfo = action.payload;
      },
    );
    builder.addCase(initializeWallet.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to create wallet';
    });

    // Add funds
    builder.addCase(addFunds.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      addFunds.fulfilled,
      (state, action: PayloadAction<Transaction>) => {
        state.loading = false;
        // Wallet info and transactions will be refreshed via dispatch in the thunk

        // Update the local wallet amount optimistically if wallet exists
        if (state.walletInfo && action.payload.amount) {
          state.walletInfo.amount += action.payload.amount;
        }
      },
    );
    builder.addCase(addFunds.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to add funds';
    });

    // Withdraw funds
    builder.addCase(withdrawAmount.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      withdrawAmount.fulfilled,
      (state, action: PayloadAction<Transaction>) => {
        state.loading = false;
        // Wallet info and transactions will be refreshed via dispatch in the thunk

        // Update the local wallet amount optimistically if wallet exists
        if (state.walletInfo && action.payload.amount) {
          state.walletInfo.amount -= action.payload.amount;
        }
      },
    );
    builder.addCase(withdrawAmount.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to withdraw funds';
    });
  },
});

export const { clearWalletError, updateWalletBalance } = walletSlice.actions;

export const selectWalletInfo = (state: RootState) => state.wallet.walletInfo;
export const selectTransactions = (state: RootState) =>
  state.wallet.transactions;
export const selectWalletLoading = (state: RootState) => state.wallet.loading;
export const selectWalletError = (state: RootState) => state.wallet.error;

export default walletSlice.reducer;
