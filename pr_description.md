🎯 **What:** Added an error path test in `previsao.test.js` to simulate a fetch failure and ensure the error message is displayed on the `Previsao` page.
📊 **Coverage:** Covered the error state (`catch (err)`) when fetching forecast data, asserting that the corresponding error text renders appropriately.
✨ **Result:** Improved test coverage by verifying that network or parsing errors during data fetching are handled gracefully and communicated to the user.
