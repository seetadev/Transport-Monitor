import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import ReactGA from 'react-ga';

export const Analytics: React.FC<{ trackingId: string }> = ({
  trackingId,
  children,
}) => {
  const history = useHistory();

  const pageView = (location: { pathname: string }) => {
    const page = location.pathname || window.location.pathname;
    ReactGA.set({ page: page });
    ReactGA.pageview(page);
  };

  useEffect(() => {
    ReactGA.initialize(trackingId);
    pageView(history.location);
  }, []);

  useEffect(() => {
    history.listen(pageView);
  }, [history]);

  return <>{children}</>;
};
