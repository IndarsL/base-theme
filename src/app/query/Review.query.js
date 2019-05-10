/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { Field } from 'Util/Query';

class Review {
    getAddProductReview(reviewItem) {
        const mutation = new Field('addProductReview')
            .addArgument('productReviewItem', 'ProductReviewInput!', reviewItem)
            .addField('detail');

        return mutation;
    }

    getProductReviewsQuery() {
        // const { sku } = product;
        const ratingVotes = new Field('rating_votes')
            .addField('rating_code')
            .addField('percent');

        const query = new Field('getProductReviews')
            .addArgument('product_sku', 'String!', 'n31191497')
            .addField('nickname')
            .addField('title')
            .addField('detail')
            .addField('created_at')
            .addField(ratingVotes);

        return query;
    }
}

export default new Review();
