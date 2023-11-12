const removeHistory = async (req, res) => {
    try {
        const { history_id } = req.params
        const equalHistory = await historyModel.findOne({ history_id })
        if(equalHistory === 0) return res.json({ status: 404, message: 'History not found!' })

        const deleteHistory = await historyModel.deleteOne({ history_id })
        if(!deleteHistory) return res.json({ status: 404, message: 'Failed for delete history!' })

        return res.json({ status: 200, message: 'Successfully remove history!' })

    } catch (error) {
        return res.json({ status: 500, message:'Failed to remove history!', error })
    }
}

const getAllHistory = async (req, res) => {
    try {  
        const { id } = req.params
        const filter = {
            $or: [
                { seller_id: id },
                { consumer_id: id }
            ]
        };

        const data = await historyModel.find(filter)
        
        if(data.length === 0) return res.json({ status: 404, message: 'Data history not found!' })
        
        return res.json({ status: 200, message: 'Successfully get data history!', data })

    } catch (error) {
        return res.json({ status: 500, message: 'Failed to get history!', error })
    }
}

module.exports = {
    removeHistory,
    getAllHistory
}