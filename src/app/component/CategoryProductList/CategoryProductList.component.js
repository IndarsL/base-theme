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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProductCard from 'Component/ProductCard';
import { ItemsType } from 'Type/ProductList';
import './CategoryProductList.style';

/**
 * List of category products
 * @class CategoryProductList
 */
class CategoryProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prevItemsLength: 0
        };
    }

    /**
     * Properly returng prevItemsLength even if category is switched
     * @param {*} props
     * @param {*} state
     */
    static getDerivedStateFromProps(props, state) {
        const { items, isLoading } = props;
        const { prevItemsLength } = state;

        if (isLoading) return { prevItemsLength: 0 };
        if (items.length !== prevItemsLength) return { prevItemsLength };
        return null;
    }

    /**
     * Show loading placeholders while products are fetching
     * @return {void}
     */
    componentDidUpdate() {
        const { prevItemsLength } = this.state;
        const { items, totalItems } = this.props;
        const shouldUpdateList = this.node && prevItemsLength !== items.length
         && items.length !== 0 && items.length <= totalItems;

        if (shouldUpdateList) {
            if ('IntersectionObserver' in window) {
                const options = {
                    rootMargin: '0px',
                    threshold: 0.1
                };

                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (entry.intersectionRatio > 0) {
                            this.stopObserving();
                            this.showLoading();
                        }
                    });
                }, options);

                this.observer.observe(this.node);
            } else {
                this.showLoading();
            }
        }
    }

    stopObserving() {
        if (this.observer) {
            if (this.observer.unobserve) {
                this.observer.unobserve(this.node);
            }
            if (this.observer.disconnect) {
                this.observer.disconnect();
            }
            this.observer = null;
        }
    }

    /**
     * Increase page count and update previous items length
     */
    showLoading() {
        const { items, increasePage } = this.props;
        this.setState({ prevItemsLength: items.length });
        increasePage();
    }

    renderNoProducts() {
        return (
            <div
              block="CategoryProductList"
              elem="NoProducts"
            >
                No products found
            </div>
        );
    }

    renderProducts() {
        const { items, customFilters } = this.props;

        if (items.length === 0) return this.renderNoProducts();

        return items.map(product => (
            <ProductCard
              product={ product }
              key={ product.id }
              customFilters={ customFilters }
              arePlaceholdersShown
            />
        ));
    }

    /**
     * render placeholders beneath the product list
     */
    renderPlaceholder(showLoadMore, isLoading) {
        const renderPlaceholders = () => (
            <>
                <ProductCard product={ {} } />
                <ProductCard product={ {} } />
                <ProductCard product={ {} } />
            </>
        );

        if (isLoading) {
            return renderPlaceholders();
        }

        if (showLoadMore) {
            return (
                <div
                  block="CategoryProductList"
                  elem="Placeholder"
                  ref={ (node) => { this.node = node; } }
                >
                    { renderPlaceholders() }
                </div>
            );
        }

        return null;
    }

    render() {
        const { items, totalItems, isLoading } = this.props;
        const showLoadMore = items.length < totalItems && !isLoading;

        return (
            <ul block="CategoryProductList" mods={ { isLoading } }>
                { !isLoading && this.renderProducts() }
                { this.renderPlaceholder(showLoadMore, isLoading) }
            </ul>
        );
    }
}

CategoryProductList.propTypes = {
    items: ItemsType.isRequired,
    totalItems: PropTypes.number.isRequired,
    increasePage: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    customFilters: PropTypes.objectOf(PropTypes.array)
};

CategoryProductList.defaultProps = {
    customFilters: {}
};

export default CategoryProductList;
