/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  	return { hello: 'world' }
});

// User
Route.post('/users', 'UserController.createUser');

// Auth
Route.post('/login', 'AuthController.login');
Route.post('/login/with-pin', 'AuthController.loginWithPin');

Route.post('/send-password-reset', 'AuthController.sendPasswordReset');
Route.post('/verify-reset-code', 'AuthController.verifyResetCode');
Route.post('/reset-password', 'AuthController.resetPassword');
Route.post('/users/:user_id/verify-email', 'UserController.verifyEmail');
Route.post('/users/:user_id/resend-email-verification', 'UserController.resendEmailVerification');

Route.get('/read-google-spreadsheet', 'GoogleApiController.readGoogleSheet');
Route.get('/google/create-google-spreadsheet', 'GoogleApiController.createMerchantSpreadsheet');
Route.get('/generate-payouts', 'PaymentController.generatePayouts');
Route.get('/initiate-payouts', 'PaymentController.initiatePayouts');

Route.post('/visits/log', 'VisitController.logVisit');

Route.group(() => {
	Route.post('/paystack', 'PaymentController.paystackWebhook');
}).prefix('webhooks');

Route.group(() => {
	Route.get('/merchants/types', 'MerchantController.getMerchantTypes');
	Route.get('/merchants/:merchant_id', 'MerchantController.getMerchant');
	Route.get('/merchants', 'MerchantController.getMerchants');
	Route.get('/merchants/:merchant_id/sub-merchants', 'MerchantController.getSubMerchants');
	Route.get('/sub-merchants/:sub_merchant_id/items', 'ItemController.getItems');
	Route.get('/sub-merchants/:sub_merchant_id/groups', 'GroupController.getGroupsBySubMerchantId');
	Route.get('/sub-merchants/:sub_merchant_id/groups/:group_id/items', 'ItemController.getItemsByGroupId');
	Route.get('/sub-merchants/:sub_merchant_id/items-grouped-by-name', 'ItemController.getItemsGroupedByName');

	Route.get('/tabs/:tab_id', 'TabController.getTabNonUser');
	Route.get('/tabs/:tab_id/summary', 'TabController.getTabSummary');

	Route.get('/transaction/verify/:reference', 'PaymentController.verifyTransaction');
}).prefix('non-user');

Route.group(() => {
	// User
	Route.post('/users/change-password', 'UserController.changePassword');
	Route.post('/users/save-card', 'UserController.saveCard');
	Route.get('/users/get-cards', 'UserController.getCards');
	Route.post('/users/:user_id/create-pin', 'UserController.createUserPin');
	Route.post('/users/:user_id/create-transaction-pin', 'UserController.createUserTransactionPin');
	Route.post('/users/withdrawal-account', 'UserController.addWithdrawalAccount');
	Route.get('/users/withdrawal-account', 'UserController.getWithdrawalAccount');
	Route.get('/users', 'UserController.getUsers');
	Route.get('/users/:user_id/get-to-dos', 'UserController.getUserToDos');
	Route.get('/users/me', 'UserController.getMyProfile');
	Route.get('/users/:user_id', 'UserController.getUser');
	Route.post('/users/cards/:card_detail_id/charge', 'PaymentController.chargeCard').middleware('pin');
	Route.post('/users/initiate-withdrawal', 'UserController.initiateWithdrawal').middleware('pin');

	// Merchants
	Route.post('/merchants/:merchant_id/sub-merchants', 'MerchantController.createSubMerchant');
	Route.get('/merchants/:merchant_id/sub-merchants', 'MerchantController.getSubMerchants');
	Route.patch('/merchants/:merchant_id', 'MerchantController.updateMerchant');
	Route.delete('/merchants/:merchant_id', 'MerchantController.deleteMerchant');
	Route.post('/sub-merchants/:sub_merchant_id/managers', 'MerchantController.addManager');
	Route.get('/sub-merchants/:sub_merchant_id/managers', 'MerchantController.getManagers');
	Route.delete('/managers/:manager_id', 'MerchantController.deleteManager');
	Route.get('/sub-merchants/:sub_merchant_id/earnings', 'MerchantController.getSubMerchantEarnings');
	Route.get('/merchants/:merchant_id/dashboard-metrics', 'MerchantController.getMerchantDashboardMetrics');

	// Categories
	Route.post('/sub-merchants/:sub_merchant_id/categories', 'CategoryController.createCategories');
	Route.get('/sub-merchants/:sub_merchant_id/categories', 'CategoryController.getCategories');
	Route.get('/categories/:category_id', 'CategoryController.getCategory');
	Route.patch('/categories/:category_id', 'CategoryController.updateCategory');

	// Groups
	Route.post('/sub-merchants/:sub_merchant_id/groups', 'GroupController.createGroups');
	Route.get('/sub-merchants/:sub_merchant_id/groups', 'GroupController.getGroups');
	Route.get('/groups/:group_id', 'GroupController.getGroup');
	Route.patch('/groups/:group_id', 'GroupController.updateGroup');
	
	// Items
	Route.post('/sub-merchants/:sub_merchant_id/items', 'ItemController.createItems');
	Route.patch('/items/:item_id', 'ItemController.updateItem');
	Route.get('/sub-merchants/:sub_merchant_id/items', 'ItemController.getItems');
	Route.get('/items/:item_id', 'ItemController.getItem');
	Route.delete('/items/:item_id', 'ItemController.deleteItem');

	// Tabs
	Route.get('/merchants/:merchant_id/tabs', 'TabController.getMerchantTabs');
	Route.post('/sub-merchants/:sub_merchant_id/tabs/request-confirmation-code', 'TabController.requestConfirmationCode');
	Route.post('/sub-merchants/:sub_merchant_id/tabs', 'TabController.openTab');
	Route.get('/sub-merchants/:sub_merchant_id/tabs', 'TabController.getTabs');
	Route.patch('/tabs/:tab_id', 'TabController.updateTab');
	Route.get('/tabs/me', 'TabController.getMe');
	Route.get('/tabs/:tab_id', 'TabController.getTab');
	Route.post('/tabs/:tab_id/items', 'TabController.addItemsToTab');
	Route.delete('/tabs/:tab_id', 'TabController.deleteTab');
	Route.post('/tabs/:tab_id/request-add-payer-confirmation-code', 'TabController.requestAddPayerConfirmationCode');
	Route.post('/tabs/:tab_id/add-payer', 'TabController.addPayer');
	Route.delete('/tabs/:tab_id/remove-payer', 'TabController.removePayer');
	Route.post('/tabs/:tab_id/request-payment', 'TabController.requestPayment');
	Route.post('/tabs/:tab_id/pay-bill', 'TabController.payBill');
	Route.post('/tabs/:tab_id/apply-discount', 'TabController.applyDiscountToTab');
	Route.get('/tabs/:tab_id/summary', 'TabController.getTabSummary');

	// Wallets
	Route.get('/wallets/me', 'WalletController.getMe');
	Route.get('/users/:user_id/wallets', 'WalletController.getWallet');
	Route.post('/wallets/:wallet_id/topup', 'WalletController.topupWallet');
	Route.post('/wallets/:wallet_id/withdraw', 'WalletController.withdrawFromWallet');
	Route.post('/wallets/:wallet_id/initiate-topup', 'WalletController.initiateTopup');
	Route.post('/wallets/get-payment-url', 'PaymentController.initialize');

	// Payment
	Route.get('/get-account-name', 'PaymentController.getAccountName');
	Route.get('/list-banks', 'PaymentController.listBanks');

	// Activites
	Route.get('/users/:user_id/activities', 'ActivityController.getActivities');
}).middleware('auth');
