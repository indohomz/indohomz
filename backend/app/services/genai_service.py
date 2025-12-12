"""
IndoHomz GenAI Service

AI-powered report generation and natural language Q&A for real estate analytics.
"""

import httpx
from typing import Dict, Any, List
from datetime import datetime
import json
import os
from app.core.config import settings


class GenAIService:
    def __init__(self):
        # Initialize API keys
        self.openai_key = settings.OPENAI_API_KEY if hasattr(settings, 'OPENAI_API_KEY') else os.getenv('OPENAI_API_KEY')
        self.tavily_key = settings.TAVILY_API_KEY if hasattr(settings, 'TAVILY_API_KEY') else os.getenv('TAVILY_API_KEY')
    
    async def generate_report(self, report_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a natural language report from data"""
        
        # Create context-specific prompts
        prompts = {
            "property_overview": self._create_property_overview_prompt(data),
            "availability_status": self._create_availability_prompt(data),
            "lead_insights": self._create_lead_insights_prompt(data),
            "listing_performance": self._create_listing_performance_prompt(data),
            "market_analysis": self._create_market_analysis_prompt(data)
        }
        
        prompt = prompts.get(report_type, self._create_generic_prompt(data))
        
        try:
            if self.openai_key:
                response = await self._generate_with_openai(prompt)
            elif self.tavily_key:
                response = await self._generate_with_tavily(prompt)
            else:
                response = self._generate_template_report(report_type, data)
            return self._parse_report_response(response) if isinstance(response, str) else response
        except Exception as e:
            return self._generate_template_report(report_type, data)
    
    async def answer_question(self, question: str, context: Dict[str, Any]) -> str:
        """Answer a business question using the provided context"""
        
        prompt = f"""
        You are IndoHomz's real estate analytics assistant. Based on the following property and lead data, answer the user's question in a clear and actionable way.
        
        Business Context:
        {json.dumps(context, indent=2, default=str)}
        
        User Question: {question}
        
        Please provide a concise and helpful answer based on the data provided. Focus on real estate metrics like occupancy, leads, and property performance.
        """
        
        try:
            if self.openai_key:
                return await self._generate_with_openai(prompt)
            elif self.tavily_key:
                return await self._generate_with_tavily(prompt)
            else:
                return self._answer_question_template(question, context)
        except Exception as e:
            return f"I apologize, but I'm unable to process your question at the moment. Error: {str(e)}"
    
    async def _generate_with_openai(self, prompt: str) -> str:
        """Generate response using OpenAI API"""
        headers = {
            "Authorization": f"Bearer {self.openai_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": settings.OPENAI_MODEL if hasattr(settings, 'OPENAI_MODEL') else "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are IndoHomz's AI assistant specializing in real estate analytics. Provide clear, actionable insights about property listings and lead management."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 1500,
            "temperature": 0.7
        }
        
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=60
                )
                resp.raise_for_status()
                data = resp.json()
                return data["choices"][0]["message"]["content"]
            except Exception as e:
                raise Exception(f"OpenAI API error: {str(e)}")
    
    async def _generate_with_tavily(self, prompt: str) -> str:
        """Generate response using Tavily API"""
        headers = {"Authorization": f"Bearer {self.tavily_key}", "Content-Type": "application/json"}
        payload = {"prompt": prompt, "max_tokens": 1500, "temperature": 0.7}
        
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.post(
                    "https://api.tavily.com/v1/generate",
                    headers=headers,
                    json=payload,
                    timeout=30
                )
                resp.raise_for_status()
                data = resp.json()
                return data.get("result", "")
            except Exception as e:
                raise Exception(f"Tavily API error: {str(e)}")
    
    def _create_property_overview_prompt(self, data: Dict[str, Any]) -> str:
        """Create prompt for property overview report"""
        return f"""
        Generate a comprehensive property portfolio report for IndoHomz based on the following data:
        
        Total Properties: {data.get('total_properties', 0)}
        Available Properties: {data.get('available_properties', 0)}
        Rented Properties: {data.get('rented_properties', 0)}
        Occupancy Rate: {data.get('occupancy_rate', 0)}%
        
        Property Types: {json.dumps(data.get('property_types', []))}
        Locations: {json.dumps(data.get('locations', []))}
        
        Please provide:
        1. A brief executive summary (2-3 sentences)
        2. Detailed analysis of the property portfolio
        3. 3-5 actionable recommendations for portfolio optimization
        
        Format the response as JSON with keys: "summary", "detailed_analysis", "recommendations" (as a list)
        """
    
    def _create_availability_prompt(self, data: Dict[str, Any]) -> str:
        """Create prompt for availability status report"""
        return f"""
        Generate an availability status report for IndoHomz based on the following data:
        
        Total Properties: {data.get('total_properties', 0)}
        Available Now: {data.get('available_now', 0)}
        Currently Rented: {data.get('currently_rented', 0)}
        Availability Rate: {data.get('availability_rate', 0)}%
        
        Breakdown by Type: {json.dumps(data.get('by_type', []))}
        
        Please provide:
        1. A brief executive summary of availability health
        2. Detailed analysis of availability patterns
        3. 3-5 actionable recommendations for improving occupancy
        
        Format the response as JSON with keys: "summary", "detailed_analysis", "recommendations" (as a list)
        """
    
    def _create_lead_insights_prompt(self, data: Dict[str, Any]) -> str:
        """Create prompt for lead insights report"""
        return f"""
        Generate a lead insights report for IndoHomz based on the following data:
        
        Analysis Period: {data.get('period', 'N/A')}
        Total Leads: {data.get('total_leads', 0)}
        Leads in Period: {data.get('leads_in_period', 0)}
        Converted Leads: {data.get('converted_leads', 0)}
        Conversion Rate: {data.get('conversion_rate', 0)}%
        
        Lead Status Distribution: {json.dumps(data.get('by_status', []))}
        Lead Source Distribution: {json.dumps(data.get('by_source', []))}
        
        Please provide:
        1. A brief executive summary of lead performance
        2. Detailed analysis of lead funnel and conversion patterns
        3. 3-5 actionable recommendations for improving lead conversion
        
        Format the response as JSON with keys: "summary", "detailed_analysis", "recommendations" (as a list)
        """
    
    def _create_listing_performance_prompt(self, data: Dict[str, Any]) -> str:
        """Create prompt for listing performance report"""
        return f"""
        Generate a listing performance report for IndoHomz based on the following data:
        
        Analysis Period: {data.get('period', 'N/A')}
        Top Performing Listings: {json.dumps(data.get('top_listings', []))}
        
        Please provide:
        1. A brief executive summary of listing performance
        2. Detailed analysis of top performers and patterns
        3. 3-5 actionable recommendations for improving listing engagement
        
        Format the response as JSON with keys: "summary", "detailed_analysis", "recommendations" (as a list)
        """
    
    def _create_market_analysis_prompt(self, data: Dict[str, Any]) -> str:
        """Create prompt for market analysis report"""
        return f"""
        Generate a market analysis report for IndoHomz based on the following data:
        
        Total Properties: {data.get('total_properties', 0)}
        Property Type Distribution: {json.dumps(data.get('property_type_distribution', []))}
        
        Please provide:
        1. A brief executive summary of market position
        2. Detailed analysis of market segments and opportunities
        3. 3-5 actionable recommendations for market strategy
        
        Format the response as JSON with keys: "summary", "detailed_analysis", "recommendations" (as a list)
        """
    
    def _create_generic_prompt(self, data: Dict[str, Any]) -> str:
        """Create generic prompt for unknown report types"""
        return f"""
        Generate a business intelligence report for IndoHomz based on the following data:
        
        {json.dumps(data, indent=2, default=str)}
        
        Please provide:
        1. A brief executive summary
        2. Detailed analysis of the data
        3. 3-5 actionable recommendations
        
        Format the response as JSON with keys: "summary", "detailed_analysis", "recommendations" (as a list)
        """
    
    def _parse_report_response(self, response: str) -> Dict[str, Any]:
        """Parse the AI response and extract structured data"""
        try:
            # Try to parse as JSON first
            if response.strip().startswith('{'):
                return json.loads(response)
            
            # Try to find JSON in the response
            import re
            json_match = re.search(r'\{[\s\S]*\}', response)
            if json_match:
                return json.loads(json_match.group())
            
            # If not JSON, parse manually
            return {
                "summary": response[:500] if len(response) > 500 else response,
                "detailed_analysis": response,
                "recommendations": ["Review the full analysis above", "Monitor key metrics", "Implement suggested improvements"]
            }
        
        except Exception as e:
            return {
                "summary": "Report generated successfully.",
                "detailed_analysis": response[:1000] if response else "Analysis completed.",
                "recommendations": ["Review data quality", "Monitor key metrics", "Consider optimization opportunities"]
            }
    
    def _generate_template_report(self, report_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate report using templates when AI is not available"""
        
        templates = {
            "property_overview": {
                "summary": f"IndoHomz portfolio consists of {data.get('total_properties', 0)} properties with {data.get('available_properties', 0)} currently available ({data.get('occupancy_rate', 0)}% occupancy rate).",
                "detailed_analysis": f"The property portfolio shows {data.get('total_properties', 0)} total listings across multiple property types and locations. {data.get('rented_properties', 0)} properties are currently rented, indicating healthy demand. The availability rate of {100 - data.get('occupancy_rate', 0):.1f}% suggests room for growth.",
                "recommendations": [
                    "Focus on marketing available properties in high-demand areas",
                    "Analyze pricing strategy for properties with low inquiry rates",
                    "Diversify property types based on market demand",
                    "Implement virtual tours to increase lead conversion"
                ]
            },
            "availability_status": {
                "summary": f"Current availability rate is {data.get('availability_rate', 0)}% with {data.get('available_now', 0)} properties ready for immediate occupancy.",
                "detailed_analysis": f"Out of {data.get('total_properties', 0)} properties, {data.get('available_now', 0)} are available and {data.get('currently_rented', 0)} are rented. This indicates a {100 - data.get('availability_rate', 0):.1f}% occupancy rate.",
                "recommendations": [
                    "Prioritize marketing for properties available longest",
                    "Review pricing for properties with extended availability",
                    "Implement automated lead follow-up for available listings",
                    "Consider promotional offers for immediate move-ins"
                ]
            },
            "lead_insights": {
                "summary": f"Lead analysis shows {data.get('total_leads', 0)} total inquiries with a {data.get('conversion_rate', 0)}% conversion rate.",
                "detailed_analysis": f"During the period {data.get('period', 'analyzed')}, IndoHomz received {data.get('leads_in_period', 0)} new leads. {data.get('converted_leads', 0)} leads converted to tenants, resulting in a {data.get('conversion_rate', 0)}% conversion rate.",
                "recommendations": [
                    "Improve response time for new inquiries",
                    "Implement lead scoring to prioritize high-intent prospects",
                    "Analyze drop-off points in the conversion funnel",
                    "A/B test different follow-up strategies"
                ]
            },
            "listing_performance": {
                "summary": "Listing performance analysis reveals key patterns in property engagement and lead generation.",
                "detailed_analysis": f"Analysis for {data.get('period', 'the period')} shows varying levels of engagement across listings. Top performing properties demonstrate strong market fit.",
                "recommendations": [
                    "Replicate successful listing strategies across portfolio",
                    "Improve photos and descriptions for underperforming listings",
                    "Consider price adjustments based on performance data",
                    "Highlight unique amenities in marketing materials"
                ]
            },
            "market_analysis": {
                "summary": f"Market analysis of {data.get('total_properties', 0)} properties reveals diverse portfolio composition.",
                "detailed_analysis": f"The IndoHomz portfolio spans multiple property types and price segments. Current market position shows opportunities for strategic expansion.",
                "recommendations": [
                    "Monitor competitor pricing and offerings",
                    "Expand in high-demand property segments",
                    "Develop partnerships with corporate clients",
                    "Consider seasonal pricing strategies"
                ]
            }
        }
        
        return templates.get(report_type, templates["property_overview"])
    
    def _answer_question_template(self, question: str, context: Dict[str, Any]) -> str:
        """Provide template-based answers when AI is not available"""
        
        question_lower = question.lower()
        
        properties = context.get("properties", {})
        leads = context.get("leads", {})
        
        if any(word in question_lower for word in ["available", "availability", "vacant"]):
            return f"Based on current data, IndoHomz has {properties.get('available_properties', 0)} available properties out of {properties.get('total_properties', 0)} total listings."
        
        elif any(word in question_lower for word in ["lead", "inquiry", "inquiries"]):
            return f"IndoHomz has {leads.get('total_leads', 0)} total leads with a {leads.get('conversion_rate', 0)}% conversion rate. {leads.get('new_leads', 0)} are new inquiries."
        
        elif any(word in question_lower for word in ["property", "properties", "listing"]):
            return f"The IndoHomz portfolio includes {properties.get('total_properties', 0)} properties. {properties.get('available_properties', 0)} are available and {properties.get('rented_properties', 0)} are currently rented."
        
        elif any(word in question_lower for word in ["conversion", "convert"]):
            return f"The current lead conversion rate is {leads.get('conversion_rate', 0)}%. {leads.get('converted_leads', 0)} leads have been successfully converted."
        
        else:
            return f"I can help you with questions about properties, availability, leads, and conversions. Currently, IndoHomz manages {properties.get('total_properties', 0)} properties with {leads.get('total_leads', 0)} active leads."
