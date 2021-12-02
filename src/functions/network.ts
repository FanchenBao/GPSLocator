/**
 * @format
 */
import NetInfo from '@react-native-community/netinfo';

/** An event listener that constantly monitors the current network connectivity.
If connection to the internet is lost, this listener immediately sets error to
network error and update a component state `hasInternet`. Once internet is
back, the listener cancels the error message about network error.

@param setHasInternet A function to update the `hasInternet` state in a component
@param setError A function to update the current error message.
@param error The current error message. All screens are designed to have only
  one error message at a time. This allows us to check whether we can remove the
  error message when the internet is back.
@param uponInternetLossExtraAction Additional action callback to perform when
  the Internet is lost. Default to a no action function.
 */
export const networkStatusListener = (
  setHasInternet: (arg: boolean) => void,
  setError: (err: string) => void,
  error: string,
  uponInternetLossExtraAction: () => void = () => {
    // Default function is a no op.
  },
): (() => void) =>
  NetInfo.addEventListener(state => {
    setHasInternet(Boolean(state.isInternetReachable));
    if (!state.isInternetReachable) {
      setError('Network Error. Please try again later');
      uponInternetLossExtraAction();
    } else if (error === 'Network Error. Please try again later') {
      // Only clear the error if the current error is networkError. Otherwise
      // do nothing, because some other error is currently being displayed.
      setError('');
    }
  });
