import { createSlice, PayloadAction } from '@reduxjs/toolkit';
 
interface MessageState {
  messages: { _id: string|undefined, content: string, time: string }[];
}

const initialState: MessageState = {
  messages: [],
};
 
const lastMessageSlice = createSlice({
  name: 'lastMessage',
  initialState,
  reducers: {
    setLastMessage: (state, action: PayloadAction<{ userId: string|undefined, content: string }>) => {
      const { userId, content } = action.payload;
      const time = new Date().toISOString();
      const index = state.messages.findIndex((m) => m._id === userId);
      if (index === -1) {
        state.messages.push({ _id: userId, content, time });
      } else {
        state.messages[index].content = content;
        state.messages[index].time = time;
      }
    },
  },
  
});

export const { setLastMessage } = lastMessageSlice.actions;
export default lastMessageSlice.reducer;
