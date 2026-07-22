const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const cookiebotId = process.env.NEXT_PUBLIC_COOKIEBOT_ID;

export function ConsentAnalytics() {
  return (
    <>
      {cookiebotId && (
        <script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid={cookiebotId}
          type="text/javascript"
          async
        />
      )}
      {googleAnalyticsId && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            type="text/plain"
            data-cookieconsent="statistics"
          />
          <script
            type="text/plain"
            data-cookieconsent="statistics"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}');
              `,
            }}
          />
        </>
      )}
    </>
  );
}
