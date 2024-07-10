import { Box } from "native-base";

export const Badge = () => {
  return <Box bg={{
    linearGradient: {
      colors: ['lightBlue.300', 'violet.800'],
      start: [0, 0],
      end: [1, 0]
    }
  }} p="12" rounded="xl" _text={{
    fontSize: 'md',
    fontWeight: 'medium',
    color: 'warmGray.50',
    textAlign: 'center'
  }}>
      ace
    </Box>;
};