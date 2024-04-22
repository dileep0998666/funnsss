const express = require('express')
const Account = require('../models/atm')

const router = express.Router()


router.post('/create', async (req, res) => {
    
        console.log('Received request body:', req.body);
    
        const { account, initialBalance } = req.body;
    
        // Validation logic
    
    
   

    // Check if the 'account' and 'initialBalance' fields are present
    if (account === undefined || initialBalance === undefined) {
        return res.status(400).json({ error: 'Both account number and initial balance are required.' });
    }

    // Check if 'account' is a number
    if (typeof account !== 'number') {
        return res.status(400).json({ error: 'Account number must be a number.' });
    }

    // Check if the account already exists
    const existingAccount = await Account.findOne({ account });
    if (existingAccount) {
        return res.status(400).json({ error: 'Account already exists' });
    }

    try {
        // Create a new account
        const newAccount = new Account({
            account,
            balance: initialBalance,
            transactions: [],
        });

        // Save the new account to the database
        await newAccount.save();

        // Respond with a success message and the new account
        res.status(201).json({ message: 'Account created successfully', account: newAccount });
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/:account/balance', async (req, res) => {
    try {
        const account = req.params.account
        const accountData = await Account.findOne({ account })

        if (accountData) {
            res.json({ balance: accountData.balance })
        } else {
            res.status(404).json({ error: 'Account not found' })
        }
    } catch (error) {
        console.error('Error retrieving account balance:', error)
        res.status(500).json({ error: 'Server error' })
    }
})


router.post('/:account/withdraw', async (req, res) => {
    const { account } = req.params
    const { amount, type, date } = req.body

    try {
        const accountData = await Account.findOne({ account })

        if (!accountData) {
            return res.status(404).json({ error: 'Account not found' })
        }

        if (accountData.balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' })
        }

       
        accountData.balance -= amount

        
        accountData.transactions.push({ amount, type, date: date || new Date() })

        
        await accountData.save();

        
        res.json({ message: 'Withdrawal successful', newBalance: accountData.balance })
    } catch (error) {
        console.error('Error during withdrawal:', error)
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router