
import RequestBloodForm from "@/components/RequestBloodForm";
import EligibilityTest from "@/components/EligibilityTest";
import FeedbackForm from "@/components/FeedbackForm";

const Request = () => {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Request Blood</h1>
          <p className="mt-4 text-xl text-gray-500">
            Fill out the form below to submit a blood request. We'll notify matching donors in your area.
          </p>
        </div>
        
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <EligibilityTest />
          <FeedbackForm />
        </div>
        
        <RequestBloodForm />
        
        <div className="mt-12 bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Important Information</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>All blood requests are verified before being processed.</li>
            <li>For emergency situations, please contact your hospital directly.</li>
            <li>You may be required to provide additional documentation for verification purposes.</li>
            <li>Once submitted, matching donors will be notified of your request.</li>
            <li>Our team will contact you regarding your request status within 24 hours.</li>
            <li>In India, a standard blood unit is approximately 350-450 ml (about one pint).</li>
            <li>Most transfusions require 1-3 units depending on the patient's condition.</li>
            <li>For recurring blood needs (subscription requests), we coordinate with regular donors who match your requirements.</li>
            <li>Subscription requests are ideal for patients with conditions like thalassemia, hemophilia, or those undergoing long-term treatments.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Request;
